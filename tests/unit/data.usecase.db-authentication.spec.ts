import { Authentication, AuthenticationModel } from "../../src/domain/usecases/authentication"
import { LoadAccountByEmailRepository } from "../../src/data/protocols/db/load-account-by-email-repository"
import { AccountModel } from "../../src/data/usecases/authentication/db-authentication-protocols"
import { DbAuthentication } from "../../src/data/usecases/authentication/db-authentication-usecase"

function makeFakeAuthentication(): AuthenticationModel {
  return {
    email: "any_email",
    password: "any_password"
  }
}

function makeFakeAccount(): AccountModel {
  return {
    id: "any_id",
    name: "any_name",
    email: "any_email",
    password: "any_password"
  }
}

interface SutTypes {
  sut: Authentication,
  loadAccountByEmailRepoStub: LoadAccountByEmailRepository
}

function makeLoadAccountByEmailRepository(): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (): Promise<AccountModel> {
      const account = makeFakeAccount()
      return new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

function makeSut(): SutTypes {
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepoStub)

  return {
    sut,
    loadAccountByEmailRepoStub
  }
}

describe('DbAuthentication UseCase' , () => {
  test('Should call LoadAccountByEmailRepo with correct email', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepoStub, "load")
    const authRequest = makeFakeAuthentication()
    await sut.auth(authRequest)

    expect(loadSpy).toHaveBeenCalledWith(authRequest.email)
  })

  test('Should throw if LoadAccountByEmailRepo throws', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    const error = new Error()
    jest.spyOn(loadAccountByEmailRepoStub, "load").mockReturnValueOnce(new Promise((_, reject) => reject(error)))
    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow(error)
  })
})