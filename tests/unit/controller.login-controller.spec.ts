import { LoginController } from "../../src/presentation/controllers/login/login-controller"
import { EmailValidator, HttpRequest, PasswordValidator } from "../../src/presentation/controllers/login/login-protocols"
import { badRequest } from "../../src/presentation/helpers/http-helper"
import { InvalidParamError, MissingParamError  } from "../../src/presentation/errors"
import { EmailValidatorAdapter} from "../../src/utils/email-validator-adapter"

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

function makeSut(): SutTypes {
  const emailValidatorStub = new EmailValidatorAdapter()

  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

function makeFakeHttpRequest(): HttpRequest {
  return {
    body: {
      email: "valid_email@email.com",
      password: "valid_password"
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
    const { sut } = makeSut()
    // const spyEmailValidatorStubIsValid = jest.spyOn(emailValidatorStub, "isValid")

    const httpRequest = makeFakeHttpRequest()
    httpRequest.body.email = "invalid_email"

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

})
