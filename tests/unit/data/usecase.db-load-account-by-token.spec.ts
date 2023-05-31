import { DbLoadAccountByToken } from '../../../src/data/usecases/load-account-by-token/db-load-account-by-token'
import { AccountModel, Decrypter } from '../../../src/data/usecases/load-account-by-token/db-load-account-by-token-protocols'
import { LoadAccountByTokenRepository } from '../../../src/data/protocols/db/account/load-account-by-token-repository'

function makeFakeAccount(): AccountModel {
  return {
    id: 'any-id',
    email: 'any-email',
    password: 'any-password',
    createdAt: new Date(2023, 11, 31),
    name: 'any-name',
    verified: true
  }
}

function makeDecrypter(): Decrypter {
  class DecrypterStub implements Decrypter {
    decrypt (encryptedValue: string): Promise<string> {
      return new Promise(resolve => resolve('decrypted-value'))
    }
  }
  return new DecrypterStub()
}

type SutType = {
  sut: DbLoadAccountByToken,
  decrypterStub: Decrypter,
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

function makeLoadAccountByToken(): LoadAccountByTokenRepository {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

function makeSut(): SutType {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByToken()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken' , () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any-token', 'any-role')

    expect(decryptSpy).toHaveBeenCalledWith('any-token')
  })

  test('Should call loadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any-token', 'any-role')

    expect(loadByTokenSpy).toHaveBeenCalledWith('decrypted-value', 'any-role')
  })

  test('Should return null if loadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockResolvedValue(null)
    const account = await sut.load('any-token', 'any-role')
    
    expect(account).toBeNull()
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const promise =  sut.load('any-token', 'any-role')

    await expect(promise).rejects.toThrow()
  })


  test('Should return an account if loadAccountByTokenRepository returns an account', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any-token', 'any-role')

    expect(account).toStrictEqual(makeFakeAccount())
  })

})
