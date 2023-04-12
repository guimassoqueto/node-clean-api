import { Authentication, AuthenticationModel } from "../../src/domain/usecases/authentication"
import { 
  LoadAccountByEmailRepository , 
  AccountModel, 
  HashComparer, 
  TokenGenerator, 
  UpdateAccessTokenRepository
} from "../../src/data/usecases/authentication/db-authentication-protocols"
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

function makeTokenGenerator(): TokenGenerator {
  class TokenGenerateStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise(resolve => resolve("any_token"))
    }
  }

  return new TokenGenerateStub()
}

function makeUpdateAccessTokenRepositoryStub(): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: Authentication,
  loadAccountByEmailRepoStub: LoadAccountByEmailRepository,
  hashComparerStub: HashComparer, 
  tokenGeneratorStub: TokenGenerator,
  updateAccessTokenRepository: UpdateAccessTokenRepository
}

function makeSut(): SutTypes {
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepository = makeUpdateAccessTokenRepositoryStub()

  const sut = new DbAuthentication(
    loadAccountByEmailRepoStub, 
    hashComparerStub, 
    tokenGeneratorStub,
    updateAccessTokenRepository
  )

  return {
    sut,
    loadAccountByEmailRepoStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepository
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

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const error = new Error()
    jest.spyOn(tokenGeneratorStub, "generate").mockReturnValueOnce(new Promise((_, reject) => reject(error)))
    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow(error)
  })

  test('Should return the aceess token if TokenGenerator DbAuthentication succeed', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toEqual("any_token")
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepository, "update")
    const AuthRequest = makeFakeAuthentication()
    await sut.auth(AuthRequest)

    expect(updateSpy).toHaveBeenCalledWith(makeFakeAccount().id, "any_token")
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()
    const error = new Error()
    jest.spyOn(updateAccessTokenRepository, "update").mockReturnValueOnce(new Promise((_, reject) => reject(error)))
    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow(error)
  })

})