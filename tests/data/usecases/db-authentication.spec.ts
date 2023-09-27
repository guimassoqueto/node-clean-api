import { 
  LoadAccountByEmailRepository , 
  AccountModel, 
  HashComparer, 
  UpdateAccessTokenRepository,
  Authentication,
  AuthenticationParams
} from '@src/data/usecases/account/authentication/db-authentication-protocols'
import { DbAuthentication } from '@src/data/usecases/account/authentication/db-authentication'
import { mockAccountModel, EncrypterSpy } from '@tests/helpers'


function mockAuthenticationParams(): AuthenticationParams {
  return {
    email: 'any-email',
    password: 'any-password'
  }
}


function makeLoadAccountByEmailRepository(): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

function makeHashComparer(): HashComparer {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}


function makeUpdateAccessTokenRepositoryStub(): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

type SutTypes =  {
  sut: Authentication,
  loadAccountByEmailRepoStub: LoadAccountByEmailRepository,
  hashComparerStub: HashComparer, 
  encrypterSpy: EncrypterSpy,
  updateAccessTokenRepository: UpdateAccessTokenRepository
}

function makeSut(): SutTypes {
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepository = makeUpdateAccessTokenRepositoryStub()

  const sut = new DbAuthentication(
    loadAccountByEmailRepoStub, 
    hashComparerStub, 
    encrypterSpy,
    updateAccessTokenRepository
  )

  return {
    sut,
    loadAccountByEmailRepoStub,
    hashComparerStub,
    encrypterSpy,
    updateAccessTokenRepository
  }
}

describe('DbAuthentication UseCase' , () => {
  test('Should call LoadAccountByEmailRepo with correct email', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepoStub, 'loadByEmail')
    const authRequest = mockAuthenticationParams()
    await sut.auth(authRequest)

    expect(loadSpy).toHaveBeenCalledWith(authRequest.email)
  })

  test('Should throw if LoadAccountByEmailRepo throws', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    const error = new Error()
    jest.spyOn(loadAccountByEmailRepoStub, 'loadByEmail').mockRejectedValueOnce(error)
    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow(error)
  })

  test('Should return null if the user related with given email is not found', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepoStub, 'loadByEmail').mockResolvedValueOnce(null)
    const authRequest = mockAuthenticationParams()
    const accessToken = await sut.auth(authRequest)

    expect(accessToken).toBeNull()
  })

  test('Should call LoadAccountByEmailRepo with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const AuthRequest = mockAuthenticationParams()
    await sut.auth(AuthRequest)

    expect(compareSpy).toHaveBeenCalledWith(AuthRequest.password, mockAccountModel().password)
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    const error = new Error()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(error)
    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow(error)
  })

  test('Should return null if HashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const AccessToken = await sut.auth(mockAuthenticationParams())

    expect(AccessToken).toBeNull()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterSpy } = makeSut()
    const authParam = mockAuthenticationParams()
    await sut.auth(authParam)

    expect(encrypterSpy.plaintext).toEqual(mockAccountModel().id)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    const error = new Error()
    jest.spyOn(encrypterSpy, 'encrypt').mockRejectedValueOnce(error)
    const authParam = mockAuthenticationParams()
    const promise = sut.auth(authParam)

    await expect(promise).rejects.toThrow(error)
  })

  test('Should return the access token if Encrypter DbAuthentication succeed', async () => {
    const { sut, encrypterSpy } = makeSut()
    const authResponse = await sut.auth(mockAuthenticationParams())

    expect(authResponse?.accessToken).toEqual(encrypterSpy.encryptedValue)
    expect(authResponse?.userName).toEqual(mockAccountModel().name)
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepository, encrypterSpy } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepository, 'updateAccessToken')
    const AuthRequest = mockAuthenticationParams()
    await sut.auth(AuthRequest)

    expect(updateSpy).toHaveBeenCalledWith(mockAccountModel().id, encrypterSpy.encryptedValue)
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()
    const error = new Error()
    jest.spyOn(updateAccessTokenRepository, 'updateAccessToken').mockRejectedValueOnce(error)
    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow(error)
  })

})