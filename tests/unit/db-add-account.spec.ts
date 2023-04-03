import { DbAddAcccount } from "../../src/data/usecases/add-account/db-add-account-usecase"
import { AddAccountModel } from "../../src/domain/usecases/add-account"
import { Encrypter } from "../../src/data/usecases/add-account/db-add-account-protocols"


function makeEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve("hashed_password"));
    }
  }
  return new EncrypterStub()
}


interface SutTypes {
  sut: DbAddAcccount,
  encrypterStub: Encrypter
}


function makeSut(): SutTypes {
  const encrypterStub = makeEncrypter();
  const addAccountStub = new DbAddAcccount(encrypterStub);
  
  return {
    sut: addAccountStub,
    encrypterStub: encrypterStub
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


  test('Should call Encrypter with correct password', async () => {
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
})
