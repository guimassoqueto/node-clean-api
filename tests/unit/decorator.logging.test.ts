import { LoggingControllerDecorator } from "../../src/main/decorators/logging"
import { Controller, HttpRequest, HttpResponse } from "../../src/presentation/protocols"

interface sutTypes {
  sut: LoggingControllerDecorator,
  controllerStub: Controller
}

function makeController(): Controller {
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

function makeSut(): sutTypes {
  const controllerStub = makeController()
  const loggingControllerDecoratorStub = new LoggingControllerDecorator(controllerStub)

  return {
    sut: loggingControllerDecoratorStub,
    controllerStub
  }

}


describe('LoggingController Decorator' , () => {
  test('Should call controller handle with the same arg as LoggingController', async () => {
    const { sut, controllerStub } = makeSut()
    
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

  test('Should return the expected data', async () => {
    const { sut, controllerStub } = makeSut()
    
    const mockResponse: HttpResponse = { statusCode: 201, body: { name: "Bibaman" } }
    const spyHandleCS = jest.spyOn(controllerStub, "handle").mockImplementation(async (httpRequest: HttpRequest) => {
      return new Promise(res => res(mockResponse))
    })
    
    const httpRequest: HttpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const promise = await sut.handle(httpRequest)

    expect(promise).toStrictEqual(mockResponse)
  })
})
