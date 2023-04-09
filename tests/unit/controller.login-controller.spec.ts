import { LoginController } from "../../src/presentation/controllers/login/login-controller"
import { HttpRequest } from "../../src/presentation/controllers/login/login-protocols"
import { badRequest } from "../../src/presentation/helpers/http-helper"
import { MissingParamError  } from "../../src/presentation/errors"

interface SutTypes {
  sut: LoginController
}

function makeSut(): SutTypes {
  const sut = new LoginController()

  return {
    sut
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

  // test('Should return 200 if the user is retrieved corretly', async () => {
  //   const sut = makeSut()
  //   const httpRequest = makeFakeHttpRequest()
  //   const httpResponse = await sut.handle(httpRequest)

  //   expect(httpResponse).toStrictEqual(ok({
  //     token: "any_token"
  //   }))
  // })

  // test('Should return 500 if handle method throws', async () => {
  //   const sut = makeSut()
  //   const handleSpy = jest.spyOn(sut, "handle").mockRejectedValueOnce(async () => {
  //     return new Promise((resolve, reject) => reject(new Error("any_error")))
  //   })
  //   const httpRequest = makeFakeHttpRequest()
  //   const httpResponse = await sut.handle(httpRequest)

  //   expect(httpResponse.statusCode).toBe(500)
  // })

})
