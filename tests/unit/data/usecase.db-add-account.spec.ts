import { DbAddAcccount } from '@src/data/usecases/account/add-account/db-add-account'
import { 
  Hasher, 
  AddAccountParams, 
  AddAccountRepository,
  AccountModel
} from '@src/data/usecases/account/add-account/db-add-account-protocols'

import { 
  mockAddAccountParams, 
  mockHasher,
  mockAccountModel
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
  hasherStub: Hasher,
  addAccountRepositoryStub: AddAccountRepository
}


function makeSut(): SutTypes {
  const hasherStub = mockHasher();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const sut = new DbAddAcccount(hasherStub, addAccountRepositoryStub);

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  };

}

describe('DbAddAcccount Usecase' , () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const encryptSpy = jest.spyOn(hasherStub, 'hash');
    const accountData: AddAccountParams = mockAddAccountParams()
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw in case of errors in encrypt method', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error());
    const account: AddAccountParams = mockAddAccountParams()
    const promise = sut.add(account)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData: AddAccountParams = mockAddAccountParams()
    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: accountData.name,
      email: accountData.email,
      password: 'hashed-password'
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
    expect(accountReturn.verified).toEqual(false)
    expect(accountReturn.createdAt).toBeTruthy()
  })
})
