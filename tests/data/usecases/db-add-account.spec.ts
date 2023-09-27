import { DbAddAcccount } from '@src/data/usecases/account/add-account/db-add-account'
import { 
  mockAddAccountParams, 
  HasherSpy,
  AddAccountRepositorySpy
} from '@tests/data/mocks'


type SutTypes =  {
  sut: DbAddAcccount,
  hasherSpy: HasherSpy,
  addAccountRepositorySpy: AddAccountRepositorySpy
}

function makeSut(): SutTypes {
  const hasherSpy = new HasherSpy();
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const sut = new DbAddAcccount(hasherSpy, addAccountRepositorySpy);

  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy
  };
}

describe('DbAddAcccount' , () => {
  test('Should call Hasher with correct plaintext', async () => {
    const { sut, hasherSpy } = makeSut();
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams);
    expect(hasherSpy.plaintext).toEqual(addAccountParams.password)
  })

  test('Should throw in case of errors in encrypt method', async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, 'hash').mockRejectedValueOnce(new Error());
    const account = mockAddAccountParams()
    const promise = sut.add(account)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut();
    const accountData = mockAddAccountParams()
    await sut.add(accountData);
    expect(addAccountRepositorySpy.accountData.email).toEqual(accountData.email)
    expect(addAccountRepositorySpy.accountData.name).toEqual(accountData.name)
    expect(addAccountRepositorySpy.accountData.password).toEqual(hasherSpy.hashedPlaintext)
  })

  test('Should throw in case of errors in add method', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    jest.spyOn(addAccountRepositorySpy, 'add').mockRejectedValueOnce(new Error())
    const account = mockAddAccountParams()
    const promise = sut.add(account)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = mockAddAccountParams()
    const accountReturn = await sut.add(account)

    expect(accountReturn).toBeTruthy()
    expect(accountReturn.email).toEqual(account.email)
    expect(accountReturn.name).toEqual(account.name)
    expect(accountReturn.createdAt).toBeTruthy()
  })
})
