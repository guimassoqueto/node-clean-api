import { HttpRequest } from "../../../src/presentation/protocols"
import { AuthMiddleware } from "../../../src/presentation/middlewares/auth-middleware"
import { forbidden, ok, serverError } from "../../../src/presentation/helpers/http/http-helper"
import { AccessDeniedError } from "../../../src/errors"
import { LoadAccountByToken } from "../../../src/domain/usecases/load-account-by-token"
import { AccountModel } from "../../../src/domain/models/account"

function makeFakeRequest(): HttpRequest {
  return {
    headers: {
      'x-access-token': 'any-token'
    },
    body: {}
  }
}

function makeFakeAccount(): AccountModel {
  return {
    id: "any-id",
    name: "any-name",
    email: "any-email@gmail.com",
    password: "any-password",
    verified: true,
    createdAt: new Date(2023, 11, 31)
  }
}

function makeLoadAccountByToken(): LoadAccountByToken {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string | undefined): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByTokenStub()
}

type SutType = {
  sut: AuthMiddleware,
  loadAccountByTokenStub: LoadAccountByToken
}

function makeSut(): SutType {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('AuthMiddleware' , () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    delete request.headers
    const response = await sut.handle(request)

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Shoul call LoadaAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load")
    const request = makeFakeRequest()
    await sut.handle(request)

    expect(loadSpy).toHaveBeenCalledWith('any-token')
  })

  test('Should return 403 if LoadAccountByToken return null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, "load").mockResolvedValue(null)
    const request = makeFakeRequest()
    const response = await sut.handle(request)

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken return an account', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const response = await sut.handle(request)

    expect(response).toEqual(ok({ accountId: "any-id" }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const error = new Error("any-error")
    jest.spyOn(loadAccountByTokenStub, "load").mockRejectedValueOnce(error)
    const request = makeFakeRequest()
    const response = await sut.handle(request)

    expect(response).toEqual(serverError(error))
  })
})
