import { LoginController } from "../../src/presentation/controllers/login/login-controller"
import { HttpRequest, Authentication, Validation } from "../../src/presentation/controllers/login/login-protocols"
import { badRequest, ok, serverError, unauthorized } from "../../src/presentation/helpers/http/http-helper"
import { MissingParamError  } from "../../src/presentation/errors"


function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub()
}

const accessToken = "fake_token"
function makeAuthentication(): Authentication {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve(accessToken))
    }
  }
  return new AuthenticationStub()
}

interface SutTypes {
  sut: LoginController
  validationStub: Validation,
  authenticationStub: Authentication
}

function makeSut(): SutTypes {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()

  const sut = new LoginController(authenticationStub, validationStub)

  return {
    sut,
    authenticationStub,
    validationStub
  }
}

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      email: "valid_email@email.com",
      password: "!@#123QWEqwe"
    }
  }
}

describe('Login Controller' , () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const spyAuth = jest.spyOn(authenticationStub, "auth")
    const httpRequest = makeFakeRequest()
    const { email, password } = httpRequest.body
    await sut.handle(httpRequest)

    expect(spyAuth).toHaveBeenCalledWith(email, password)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(new Promise((resolve, _ )=> resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 in authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const error = new Error("Some error")
    jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(new Promise((_, reject) => reject(error)))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(error))
  })

  test('Should return 200 if authentication succeed', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({ accessToken }))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, "validate")
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  })

  test('Should return 400 if Validation return an error', async () => {
    const { sut,validationStub } = makeSut()
    const error = new MissingParamError("any_field")
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(error)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(error))
  })
})
