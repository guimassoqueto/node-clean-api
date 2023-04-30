import { 
  UpdateAccountVerifiedRepository,
  Decrypter,
  LoadAccountByIdRepository,
  AccountModel,
  DeleteUnverifiedAccountByAccountTokenRepository
} from "../../src/data/usecases/account-verification/db-account-verification-protocols"
import { DbAccountVerification } from "../../src/data/usecases/account-verification/db-account-verification-usecase"

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

function makeDecrypter (): Decrypter {
  class DecrypterStub implements Decrypter {
    async decryptAccountToken (accountToken: string): Promise<string> {
      return new Promise( resolve => resolve('any-account-id') )
    }
  }
  return new DecrypterStub()
}

function makeLoadAccountByIdRepository (): LoadAccountByIdRepository {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    loadById (id: string): Promise<AccountModel | null> {
      return new Promise( resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

function makeUpdateAccountVerifiedRepository(): UpdateAccountVerifiedRepository {
  class UpdateAccountVerifiedRepositoryStub implements UpdateAccountVerifiedRepository {
    async updateVerified (id: string, verified: boolean): Promise<void> {}
  }
  return new UpdateAccountVerifiedRepositoryStub()
}

function makeDeleteUnverifiedAccountByAccountTokenRepository(): DeleteUnverifiedAccountByAccountTokenRepository {
  class DeleteUnverifiedAccountByAccountTokenRepository implements DeleteUnverifiedAccountByAccountTokenRepository {
    async deleteByAccountToken (accountToken: string): Promise<void> {}
  }
  return new DeleteUnverifiedAccountByAccountTokenRepository()
}

type SutTypes = {
  sut: DbAccountVerification,
  decrypterStub: Decrypter,
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository,
  updateAccountVerifiedRepositoryStub: UpdateAccountVerifiedRepository,
  deleteUnverifiedAccountByAccountTokenRepositoryStub: DeleteUnverifiedAccountByAccountTokenRepository
}

function makeSut (): SutTypes {
  const decrypterStub = makeDecrypter()
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  const updateAccountVerifiedRepositoryStub = makeUpdateAccountVerifiedRepository()
  const deleteUnverifiedAccountByAccountTokenRepositoryStub = makeDeleteUnverifiedAccountByAccountTokenRepository()

  const sut = new DbAccountVerification(
    decrypterStub, 
    loadAccountByIdRepositoryStub,
    updateAccountVerifiedRepositoryStub,
    deleteUnverifiedAccountByAccountTokenRepositoryStub
  )

  return {
    sut,
    decrypterStub,
    loadAccountByIdRepositoryStub,
    updateAccountVerifiedRepositoryStub,
    deleteUnverifiedAccountByAccountTokenRepositoryStub
  }
}

describe('DbAccountVerification' , () => {
  test('Should throws Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, "decryptAccountToken").mockImplementationOnce((accountToken: string) => {
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

  test('Should return false if loadAccountByIdRepositoryStub dont find the user', async () => {
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

})
