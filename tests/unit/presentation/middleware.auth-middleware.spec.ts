import { HttpRequest } from '@src/presentation/protocols'
import { AuthMiddleware } from '@src/presentation/middlewares/auth-middleware'
import { AccessDeniedError, AccountModel, LoadAccountByToken } from '@src/presentation/middlewares/auth-middleware-protocols'
import { forbidden, ok, serverError } from '@src/presentation/helpers/http/http-helper'
import { mockAccountModel } from '@tests/helpers'


function makeRequest(): HttpRequest {
  return {
    headers: {
      'x-access-token': 'any-token'
    }
  }
}


function makeLoadAccountByToken(): LoadAccountByToken {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string | undefined): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }

  return new LoadAccountByTokenStub()
}

type SutTypes = {
  sut: AuthMiddleware,
  loadAccountByTokenStub: LoadAccountByToken
}

function makeSut(role?: string): SutTypes {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('AuthMiddleware' , () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const request = makeRequest()
    delete request.headers
    const response = await sut.handle(request)

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Shoul call LoadaAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const request = makeRequest()
    await sut.handle(request)

    expect(loadSpy).toHaveBeenCalledWith('any-token', role)
  })

  test('Should return 403 if LoadAccountByToken return null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValue(null)
    const request = makeRequest()
    const response = await sut.handle(request)

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken return an account', async () => {
    const { sut } = makeSut()
    const request = makeRequest()
    const response = await sut.handle(request)

    expect(response).toEqual(ok({ accountId: 'any-id' }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const error = new Error('any-error')
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(error)
    const request = makeRequest()
    const response = await sut.handle(request)

    expect(response).toEqual(serverError(error))
  })
})
