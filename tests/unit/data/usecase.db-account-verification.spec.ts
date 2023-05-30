import {
  UpdateAccountVerifiedRepository,
  Decrypter,
  LoadAccountByIdRepository,
  AccountModel,
  DeleteUnverifiedAccountByAccountTokenRepository,
  ChangeAccountIdRepository,
  UpdateAccessTokenRepository,
  Encrypter
} from "../../../src/data/usecases/account-verification/db-account-verification-protocols"
import { DbAccountVerification } from "../../../src/data/usecases/account-verification/db-account-verification-usecase"

function makeFakeAccount(id: string = "any-id"): AccountModel {
  return {
    id: id,
    name: 'any-name',
    email: 'any-email@rmail.com',
    password: 'any-hashed-password',
    verified: false,
    createdAt: new Date(2023, 11, 31)
  }
}

function makeDecrypter(): Decrypter {
  class DecrypterStub implements Decrypter {
    async decrypt(encryptedValue: string): Promise<string> {
      return new Promise(resolve => resolve('any-account-id'))
    }
  }
  return new DecrypterStub()
}

function makeEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt (encryptedValue: string): Promise<string> {
      return new Promise(resolve => resolve("any-token"))
    }
  }
  return new EncrypterStub()
}

function makeLoadAccountByIdRepository(): LoadAccountByIdRepository {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    loadById(id: string): Promise<AccountModel | null> {
      return new Promise(resolve => resolve(makeFakeAccount()))
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
      return new Promise(resolve => resolve(makeFakeAccount("new-id")))
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
  decrypterStub: Decrypter,
  encrypterStub: Encrypter,
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository,
  updateAccountVerifiedRepositoryStub: UpdateAccountVerifiedRepository,
  changeAccountIdRepositoryStub: ChangeAccountIdRepository,
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository,
  deleteUnverifiedAccountByAccountTokenRepositoryStub: DeleteUnverifiedAccountByAccountTokenRepository
}

function makeSut(): SutTypes {
  const decrypterStub = makeDecrypter()
  const encrypterStub = makeEncrypter()
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  const updateAccountVerifiedRepositoryStub = makeUpdateAccountVerifiedRepository()
  const changeAccountIdRepositoryStub = makeChangeAccountIdRepository()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const deleteUnverifiedAccountByAccountTokenRepositoryStub = makeDeleteUnverifiedAccountByAccountTokenRepository()

  const sut = new DbAccountVerification(
    decrypterStub,
    encrypterStub,
    loadAccountByIdRepositoryStub,
    updateAccountVerifiedRepositoryStub,
    changeAccountIdRepositoryStub,
    updateAccessTokenRepositoryStub,
    deleteUnverifiedAccountByAccountTokenRepositoryStub
  )

  return {
    sut,
    decrypterStub,
    encrypterStub,
    loadAccountByIdRepositoryStub,
    updateAccountVerifiedRepositoryStub,
    changeAccountIdRepositoryStub,
    updateAccessTokenRepositoryStub,
    deleteUnverifiedAccountByAccountTokenRepositoryStub
  }
}

describe('DbAccountVerification', () => {
  test('Should throws Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, "decrypt").mockImplementationOnce((encryptedValue: string) => {
      throw new Error()
    })
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should throws Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, "encrypt").mockImplementationOnce((encryptedValue: string) => {
      throw new Error()
    })
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, "loadById").mockRejectedValueOnce(new Error())
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if loadAccountByIdRepositoryStub dont find the user', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, "loadById").mockResolvedValue(null)
    const result = await sut.verify('any-token')

    expect(result).toBeFalsy()
  })

  test('Should throw if updateAccountVerified throws', async () => {
    const { sut, updateAccountVerifiedRepositoryStub } = makeSut()
    jest.spyOn(updateAccountVerifiedRepositoryStub, "updateVerified").mockRejectedValueOnce(new Error())
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should throw if deleteUnverifiedAccountByAccountToken throws', async () => {
    const { sut, deleteUnverifiedAccountByAccountTokenRepositoryStub } = makeSut()
    jest.spyOn(deleteUnverifiedAccountByAccountTokenRepositoryStub, "deleteByAccountToken").mockRejectedValueOnce(new Error())
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if changeAccountIdRepository dont find the user', async () => {
    const { sut, changeAccountIdRepositoryStub } = makeSut()
    jest.spyOn(changeAccountIdRepositoryStub, "changeId").mockResolvedValue(null)
    const result = await sut.verify('any-token')

    expect(result).toBeFalsy()
  })

  test('Should throw if changeAccountIdRepository throws', async () => {
    const { sut, changeAccountIdRepositoryStub } = makeSut()
    jest.spyOn(changeAccountIdRepositoryStub, "changeId").mockRejectedValueOnce(new Error())
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should throw if uptadeAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, "updateAccessToken").mockRejectedValueOnce(new Error())
    const promise = sut.verify('any-token')

    await expect(promise).rejects.toThrow()
  })

  test('Should return true if DbAccountVerification works as expected', async () => {
    const { sut } = makeSut()
    const result = await sut.verify('any-token')

    expect(result).toBeTruthy()
  })
})
