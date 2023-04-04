import { DbAddAcccount } from "../../src/data/usecases/add-account/db-add-account-usecase"
import { 
  Encrypter, 
  AddAccountModel, 
  AccountModel,
  AddAccountRepository
} from "../../src/data/usecases/add-account/db-add-account-protocols"


function makeEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve("hashed_password"));
    }
  }
  return new EncrypterStub()
}

function makeAddAccountRepository(): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount: AccountModel = {
        id: "some_id",
        name: accountData.name,
        password: "hashed_password",
        email: accountData.email
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}


interface SutTypes {
  sut: DbAddAcccount,
  encrypterStub: Encrypter,
  addAccountRepositoryStub: AddAccountRepository
}


function makeSut(): SutTypes {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAcccount(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  };

}

describe('DbAddAcccount Usecase' , () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData: AddAccountModel = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password"
    }
    
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)

  })


  test('Should throw in case of errors in encrypt method', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }));

    const account: AddAccountModel = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password"
    }

    const promise = sut.add(account)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, "add")

    const accountData: AddAccountModel = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password"
    }
    
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email@email.com",
      password: "hashed_password"
    })
  })

  test('Should throw in case of errors in add method', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }));

    const account: AddAccountModel = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password"
    }

    const promise = sut.add(account)

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut();

    const account: AddAccountModel = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password"
    }

    const accountReturn = await sut.add(account)

    expect(accountReturn).toStrictEqual(Object.assign({}, account, { id: "some_id", password: "hashed_password" }))
  })
})
