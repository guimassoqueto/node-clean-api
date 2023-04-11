import { LoginController } from "../../src/presentation/controllers/login/login-controller"
import { EmailValidator, HttpRequest, PasswordValidator, Authentication } from "../../src/presentation/controllers/login/login-protocols"
import { badRequest, ok, serverError, unauthorized } from "../../src/presentation/helpers/http-helper"
import { InvalidParamError, MissingParamError  } from "../../src/presentation/errors"

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

function makePasswordValidator(): PasswordValidator {
  class PasswordValidatorStub implements PasswordValidator {
    isStrong(email: string): boolean {
      return true
    }
  }
  return new PasswordValidatorStub()
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
  emailValidatorStub: EmailValidator,
  passwordValidatorStub: PasswordValidator,
  authenticationStub: Authentication
}

function makeSut(): SutTypes {
  const emailValidatorStub = makeEmailValidator()
  const passwordValidatorStub = makePasswordValidator()
  const authenticationStub = makeAuthentication()

  const sut = new LoginController(emailValidatorStub, passwordValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    passwordValidatorStub,
    authenticationStub
  }
}

function makeFakeHttpRequest(): HttpRequest {
  return {
    body: {
      email: "valid_email@email.com",
      password: "!@#123QWEqwe"
    }
  }
}

describe('Login Controller' , () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeHttpRequest()
    delete httpRequest.body.email;
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeHttpRequest()
    delete httpRequest.body.password;
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
  })

  test('Return 400 if the email provided is not a valid email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const httpRequest = makeFakeHttpRequest()
    httpRequest.body.email = "invalid_email"
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    // EVS = EmailValidatorStub
    const spyEVSIsValid = jest.spyOn(emailValidatorStub, "isValid")
    const mockEmail = "some_email@email.com"
    const httpRequest = makeFakeHttpRequest()
    httpRequest.body.email = mockEmail
    await sut.handle(httpRequest)

    expect(spyEVSIsValid).toHaveBeenCalledWith(mockEmail)
  })

  test('Should return 500 if EmailValidator Throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    // EVS = EmailValidatorStub
    const error = new Error("Some error")
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce((email: string) => {
      throw error
    })
    const mockEmail = "some_email@email.com"
    const httpRequest = makeFakeHttpRequest()
    httpRequest.body.email = mockEmail
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(error))
  })

  test('Return 400 if the password provided is not a strong password', async () => {
    const { sut, passwordValidatorStub } = makeSut()
    jest.spyOn(passwordValidatorStub, "isStrong").mockReturnValueOnce(false)
    const httpRequest = makeFakeHttpRequest()
    httpRequest.body.password = "weak_password"
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('password')))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const spyAuth = jest.spyOn(authenticationStub, "auth")
    const httpRequest = makeFakeHttpRequest()
    const { email, password } = httpRequest.body
    await sut.handle(httpRequest)

    expect(spyAuth).toHaveBeenCalledWith(email, password)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(new Promise((resolve, _ )=> resolve(null)))
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 in authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const error = new Error("Some error")
    jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(new Promise((_, reject) => reject(error)))
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(error))
  })

  test('Should return 200 if authentication succeed', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(ok({ accessToken }))
  })

})
