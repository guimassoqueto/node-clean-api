import { Authentication, AuthenticationModel } from "../../src/domain/usecases/authentication"
import { LoadAccountByEmailRepository } from "../../src/data/protocols/db/load-account-by-email-repository"
import { AccountModel, HashComparer, TokenGenerator } from "../../src/data/usecases/authentication/db-authentication-protocols"
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
    password: "hashed_password"
  }
}

interface SutTypes {
  sut: Authentication,
  loadAccountByEmailRepoStub: LoadAccountByEmailRepository,
  hashComparerStub: HashComparer, 
  tokenGeneratorStub: TokenGenerator
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

function makeHashComparer(): HashComparer {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

function makeTokenGenerate(): TokenGenerator {
  class TokenGenerateStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise(resolve => resolve("any_token"))
    }
  }

  return new TokenGenerateStub()
}

function makeSut(): SutTypes {
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerate()
  const sut = new DbAuthentication(loadAccountByEmailRepoStub, hashComparerStub, tokenGeneratorStub)

  return {
    sut,
    loadAccountByEmailRepoStub,
    hashComparerStub,
    tokenGeneratorStub
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

  test('Should return null if the user related with given email is not found', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepoStub, "load").mockReturnValue(new Promise(resolve => resolve(null)))
    const authRequest = makeFakeAuthentication()
    const accessToken = await sut.auth(authRequest)

    expect(accessToken).toBeNull()
  })

  test('Should call LoadAccountByEmailRepo with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, "compare")
    const AuthRequest = makeFakeAuthentication()
    await sut.auth(AuthRequest)

    expect(compareSpy).toHaveBeenCalledWith(AuthRequest.password, makeFakeAccount().password)
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    const error = new Error()
    jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(new Promise((_, reject) => reject(error)))
    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow(error)
  })

  test('Should return null if HashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const AccessToken = await sut.auth(makeFakeAuthentication())

    expect(AccessToken).toBeNull()
  })


  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, "generate")
    const AuthRequest = makeFakeAuthentication()
    await sut.auth(AuthRequest)

    expect(generateSpy).toHaveBeenCalledWith(makeFakeAccount().id)
  })
})