import { DbAddAcccount } from '@src/data/usecases/account/add-account/db-add-account'
import { 
  AddAccountParams, 
  AddAccountRepository,
  AccountModel
} from '@src/data/usecases/account/add-account/db-add-account-protocols'

import { 
  mockAddAccountParams, 
  mockAccountModel,
  HasherSpy,
} from '@tests/helpers'

function mockAddAccountRepository(): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountRepositoryStub()
}


type SutTypes =  {
  sut: DbAddAcccount,
  hasherSpy: HasherSpy,
  addAccountRepositoryStub: AddAccountRepository
}


function makeSut(): SutTypes {
  const hasherSpy = new HasherSpy();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const sut = new DbAddAcccount(hasherSpy, addAccountRepositoryStub);

  return {
    sut,
    hasherSpy,
    addAccountRepositoryStub
  };

}

describe('DbAddAcccount Usecase' , () => {
  test('Should call Hasher with correct plaintext', async () => {
    const { sut, hasherSpy } = makeSut();
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams);
    expect(hasherSpy.plaintext).toEqual(addAccountParams.password)
  })

  test('Should throw in case of errors in encrypt method', async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, 'hash').mockRejectedValueOnce(new Error());
    const account: AddAccountParams = mockAddAccountParams()
    const promise = sut.add(account)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub, hasherSpy } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData: AddAccountParams = mockAddAccountParams()
    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: accountData.name,
      email: accountData.email,
      password: hasherSpy.hashedPlaintext
    })
  })

  test('Should throw in case of errors in add method', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const account: AddAccountParams = mockAddAccountParams()
    const promise = sut.add(account)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account: AddAccountParams = mockAddAccountParams()
    const accountReturn = await sut.add(account)

    expect(accountReturn).toBeTruthy()
    expect(accountReturn.email).toEqual(account.email)
    expect(accountReturn.name).toEqual(account.name)
    expect(accountReturn.createdAt).toBeTruthy()
  })
})
