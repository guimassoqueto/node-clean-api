import { LoggingControllerDecorator } from "../../src/main/decorators/logging"
import { Controller, HttpRequest, HttpResponse } from "../../src/presentation/protocols"

interface sutTypes {
  sut: Controller,
  controllerStub: Controller
}

function makeControllerStub(): Controller {
  class MockControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: { name: "Guilherme" }
      }
      return new Promise(resolve => resolve(httpResponse))
    } 
  }

  return new MockControllerStub()
}

function makeLoggingControllerDecorator(): sutTypes {
  const controllerStub = makeControllerStub()
  const loggingControllerDecoratorStub = new LoggingControllerDecorator(controllerStub)

  return {
    sut: loggingControllerDecoratorStub,
    controllerStub
  }

}


describe('LoggingController Decorator' , () => {
  test('Should call controller handle with the same arg as LoggingController', async () => {
    const { sut, controllerStub } = makeLoggingControllerDecorator()
    
    const spyHandleSut = jest.spyOn(sut, "handle")
    // CS = ControllerStub
    const spyHandleCS = jest.spyOn(controllerStub, "handle")

    const httpRequest: HttpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }
    await sut.handle(httpRequest)

    expect(spyHandleSut).toBeCalledWith(httpRequest)
    expect(spyHandleCS).toHaveBeenCalledWith(httpRequest)
  })
})
