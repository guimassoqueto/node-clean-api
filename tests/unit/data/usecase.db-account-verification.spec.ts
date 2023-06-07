import {
  UpdateAccountVerifiedRepository,
  Decoder,
  LoadAccountByIdRepository,
  AccountModel,
  DeleteUnverifiedAccountByAccountTokenRepository,
  ChangeAccountIdRepository,
  UpdateAccessTokenRepository,
  Encrypter
} from '@src/data/usecases/account/account-verification/db-account-verification-protocols'
import { DbAccountVerification } from '@src/data/usecases/account/account-verification/db-account-verification'
import { mockDecoder, mockEncrypter } from '@tests/helpers'


function mockAccount(id: string = 'any-id'): AccountModel {
  return {
    id: id,
    name: 'any-name',
    email: 'any-email@rmail.com',
    password: 'any-hashed-password',
    verified: false,
    createdAt: new Date(2023, 11, 31)
  }
}


function makeLoadAccountByIdRepository(): LoadAccountByIdRepository {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    loadById(id: string): Promise<AccountModel | null> {
      return new Promise(resolve => resolve(mockAccount()))
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

function makeUpdateAccountVerifiedRepository(): UpdateAccountVerifiedRepository {
  class UpdateAccountVerifiedRepositoryStub implements UpdateAccountVerifiedRepository {
    async updateVerified(id: string, verified: boolean): Promise<void> { }
  }
  return new UpdateAccountVerifiedRepositoryStub()
}

function makeChangeAccountIdRepository(): ChangeAccountIdRepository {
  class ChangeAccountIdRepositoryStub implements ChangeAccountIdRepository {
    async changeId (id: string): Promise<AccountModel | null> {
      return new Promise(resolve => resolve(mockAccount('new-id')))
    }
  }
  return new ChangeAccountIdRepositoryStub()
}

function makeDeleteUnverifiedAccountByAccountTokenRepository(): DeleteUnverifiedAccountByAccountTokenRepository {
  class DeleteUnverifiedAccountByAccountTokenRepositoryStub implements DeleteUnverifiedAccountByAccountTokenRepository {
    async deleteByAccountToken(accountToken: string): Promise<void> { }
  }
  return new DeleteUnverifiedAccountByAccountTokenRepositoryStub()
}

function makeUpdateAccessTokenRepository(): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {}
  }
  return new UpdateAccessTokenRepositoryStub()
}

type SutTypes = {
  sut: DbAccountVerification,
  decoderStub: Decoder,
  encrypterStub: Encrypter,
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository,
  updateAccountVerifiedRepositoryStub: UpdateAccountVerifiedRepository,
  changeAccountIdRepositoryStub: ChangeAccountIdRepository,
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository,
  deleteUnverifiedAccountByAccountTokenRepositoryStub: DeleteUnverifiedAccountByAccountTokenRepository
}

function makeSut(): SutTypes {
  const decoderStub = mockDecoder()
  const encrypterStub = mockEncrypter()
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  const updateAccountVerifiedRepositoryStub = makeUpdateAccountVerifiedRepository()
  const changeAccountIdRepositoryStub = makeChangeAccountIdRepository()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const deleteUnverifiedAccountByAccountTokenRepositoryStub = makeDeleteUnverifiedAccountByAccountTokenRepository()

  const sut = new DbAccountVerification(
    decoderStub,
    encrypterStub,
    loadAccountByIdRepositoryStub,
    updateAccountVerifiedRepositoryStub,
    changeAccountIdRepositoryStub,
    updateAccessTokenRepositoryStub,
    deleteUnverifiedAccountByAccountTokenRepositoryStub
  )

  return {
    sut,
    decoderStub,
    encrypterStub,
    loadAccountByIdRepositoryStub,
    updateAccountVerifiedRepositoryStub,
    changeAccountIdRepositoryStub,
    updateAccessTokenRepositoryStub,
    deleteUnverifiedAccountByAccountTokenRepositoryStub
  }
}

describe('DbAccountVerification', () => {
  test('Should throws Decoder throws', async () => {
    const { sut, decoderStub } = makeSut()
    jest.spyOn(decoderStub, 'decode').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should throws Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce((encryptedValue: string) => {
      throw new Error()
    })
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if loadAccountByIdRepositoryStub dont find the user', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockResolvedValue(null)
    const result = await sut.verify('any-token')

    expect(result).toBeFalsy()
  })

  test('Should throw if updateAccountVerified throws', async () => {
    const { sut, updateAccountVerifiedRepositoryStub } = makeSut()
    jest.spyOn(updateAccountVerifiedRepositoryStub, 'updateVerified').mockRejectedValueOnce(new Error())
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should throw if deleteUnverifiedAccountByAccountToken throws', async () => {
    const { sut, deleteUnverifiedAccountByAccountTokenRepositoryStub } = makeSut()
    jest.spyOn(deleteUnverifiedAccountByAccountTokenRepositoryStub, 'deleteByAccountToken').mockRejectedValueOnce(new Error())
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if changeAccountIdRepository dont find the user', async () => {
    const { sut, changeAccountIdRepositoryStub } = makeSut()
    jest.spyOn(changeAccountIdRepositoryStub, 'changeId').mockResolvedValue(null)
    const result = await sut.verify('any-token')

    expect(result).toBeFalsy()
  })

  test('Should throw if changeAccountIdRepository throws', async () => {
    const { sut, changeAccountIdRepositoryStub } = makeSut()
    jest.spyOn(changeAccountIdRepositoryStub, 'changeId').mockRejectedValueOnce(new Error())
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should throw if uptadeAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should return true if DbAccountVerification works as expected', async () => {
    const { sut } = makeSut()
    const result = await sut.verify('any-token')

    expect(result).toBeTruthy()
  })
})
