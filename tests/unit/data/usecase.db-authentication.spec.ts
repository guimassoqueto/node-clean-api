import { 
  LoadAccountByEmailRepository , 
  AccountModel, 
  HashComparer, 
  Encrypter, 
  UpdateAccessTokenRepository,
  Authentication,
  AuthenticationModel
} from "@src/data/usecases/authentication/db-authentication-protocols"
import { DbAuthentication } from "@src/data/usecases/authentication/db-authentication"

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
    password: "hashed_password",
    verified: true,
    createdAt: new Date()
  }
}

function makeLoadAccountByEmailRepository(): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (): Promise<AccountModel> {
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

function makeEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return new Promise(resolve => resolve("any_token"))
    }
  }

  return new EncrypterStub()
}

function makeUpdateAccessTokenRepositoryStub(): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

type SutTypes =  {
  sut: Authentication,
  loadAccountByEmailRepoStub: LoadAccountByEmailRepository,
  hashComparerStub: HashComparer, 
  encrypterStub: Encrypter,
  updateAccessTokenRepository: UpdateAccessTokenRepository
}

function makeSut(): SutTypes {
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepository = makeUpdateAccessTokenRepositoryStub()

  const sut = new DbAuthentication(
    loadAccountByEmailRepoStub, 
    hashComparerStub, 
    encrypterStub,
    updateAccessTokenRepository
  )

  return {
    sut,
    loadAccountByEmailRepoStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepository
  }
}

describe('DbAuthentication UseCase' , () => {
  test('Should call LoadAccountByEmailRepo with correct email', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepoStub, "loadByEmail")
    const authRequest = makeFakeAuthentication()
    await sut.auth(authRequest)

    expect(loadSpy).toHaveBeenCalledWith(authRequest.email)
  })

  test('Should throw if LoadAccountByEmailRepo throws', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    const error = new Error()
    jest.spyOn(loadAccountByEmailRepoStub, "loadByEmail").mockReturnValueOnce(new Promise((_, reject) => reject(error)))
    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow(error)
  })

  test('Should return null if the user related with given email is not found', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepoStub, "loadByEmail").mockReturnValue(new Promise(resolve => resolve(null)))
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

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, "encrypt")
    const AuthRequest = makeFakeAuthentication()
    await sut.auth(AuthRequest)

    expect(generateSpy).toHaveBeenCalledWith(makeFakeAccount().id)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    const error = new Error()
    jest.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(new Promise((_, reject) => reject(error)))
    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow(error)
  })

  test('Should return the aceess token if Encrypter DbAuthentication succeed', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toEqual("any_token")
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepository, "updateAccessToken")
    const AuthRequest = makeFakeAuthentication()
    await sut.auth(AuthRequest)

    expect(updateSpy).toHaveBeenCalledWith(makeFakeAccount().id, "any_token")
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()
    const error = new Error()
    jest.spyOn(updateAccessTokenRepository, "updateAccessToken").mockReturnValueOnce(new Promise((_, reject) => reject(error)))
    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow(error)
  })

})