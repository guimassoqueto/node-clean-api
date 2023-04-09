import { LoginController } from "../../src/presentation/controllers/login/login-controller"
import { EmailValidator, HttpRequest, PasswordValidator } from "../../src/presentation/controllers/login/login-protocols"
import { badRequest, serverError } from "../../src/presentation/helpers/http-helper"
import { InvalidParamError, MissingParamError  } from "../../src/presentation/errors"

function makeEmailValidatorStub(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    async isValid(email: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new EmailValidatorStub()
}

function makePasswordValidatorStub(): PasswordValidator {
  class PasswordValidatorStub implements PasswordValidator {
    async isStrong(email: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new PasswordValidatorStub()
}

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator,
  passwordValidatorStub: PasswordValidator
}

function makeSut(): SutTypes {
  const emailValidatorStub = makeEmailValidatorStub()
  const passwordValidatorStub = makePasswordValidatorStub()

  const sut = new LoginController(emailValidatorStub, passwordValidatorStub)

  return {
    sut,
    emailValidatorStub,
    passwordValidatorStub
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
    jest.spyOn(emailValidatorStub, "isValid").mockResolvedValue(new Promise(resolve => resolve(false)))
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
    jest.spyOn(passwordValidatorStub, "isStrong").mockResolvedValue(new Promise(resolve => resolve(false)))
    const httpRequest = makeFakeHttpRequest()
    httpRequest.body.password = "weak_password"
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('password')))
  })

})
