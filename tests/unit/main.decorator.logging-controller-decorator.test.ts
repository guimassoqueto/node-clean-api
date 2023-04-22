import { LoggingControllerDecorator } from "../../src/main/decorators/logging-controller-decorator"
import { Controller, HttpRequest, HttpResponse } from "../../src/presentation/protocols"
import { serverError, ok } from "../../src/presentation/helpers/http/http-helper"
import { LoggingRepository } from "../../src/data/protocols/db/logging/logging-error-repository"
import { AccountModel } from "../../src/domain/models/account"

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      name: "any_name",
      email: "any_email",
      password: "any_password",
      passwordConfirmation: "any_password"
    }
  }
}

function makeFakeAccount(): AccountModel {
  return {
    id: "valid_id",
    name: "valid_name",
    email: "valid_email@email.com",
    password: "valid_password",
    verified: true
  }
}


function makeController(): Controller {
  class MockControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(makeFakeAccount())))
    }
  }
  return new MockControllerStub()
}

function makeLoggingRepository(): LoggingRepository {
  class LoggingRepositoryStub implements LoggingRepository {
    async logError(stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LoggingRepositoryStub()
}

interface sutTypes {
  sut: LoggingControllerDecorator,
  controllerStub: Controller,
  loggingRepositoryStub: LoggingRepository
}

function makeSut(): sutTypes {
  const controllerStub = makeController()
  const loggingRepositoryStub = makeLoggingRepository()
  const loggingControllerDecoratorStub = new LoggingControllerDecorator(controllerStub, loggingRepositoryStub)

  return {
    sut: loggingControllerDecoratorStub,
    controllerStub,
    loggingRepositoryStub
  }
}


describe('LoggingController Decorator', () => {
  test('Should call controller handle with the same arg as LoggingController', async () => {
    const { sut, controllerStub } = makeSut()
    const spyHandleSut = jest.spyOn(sut, "handle")
    // CS = ControllerStub
    const spyHandleCS = jest.spyOn(controllerStub, "handle")
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(spyHandleSut).toBeCalledWith(httpRequest)
    expect(spyHandleCS).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the expected data', async () => {
    const { sut, controllerStub } = makeSut()
    // CS = ControllerStub
    jest.spyOn(controllerStub, "handle").mockImplementation(async (httpRequest: HttpRequest) => {
      return new Promise(res => res(ok(makeFakeAccount())))
    })
    const httpRequest: HttpRequest = makeFakeRequest()
    const promise = await sut.handle(httpRequest)

    expect(promise).toStrictEqual(ok(makeFakeAccount()))
  })

  test('Should call LoggingRepository with correct error if controller return a server error', async () => {
    const { sut, controllerStub, loggingRepositoryStub } = makeSut()
    function makeFakeError(): HttpResponse {
      const fakeError = new Error()
      fakeError.stack = "Any Stack Error"
      return serverError(fakeError)
    }
    jest.spyOn(controllerStub, "handle").mockReturnValueOnce(new Promise(resolve => resolve(makeFakeError())))
    const loggingSpy = jest.spyOn(loggingRepositoryStub, "logError")
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(loggingSpy).toHaveBeenCalledWith("Any Stack Error")

  })
})
