import { DbAddAcccount } from "../../src/data/usecases/add-account/db-add-account"
import { AddAccount, AddAccountModel } from "../../src/domain/usecases/add-account";
import { Encrypter } from "../../src/data/protocols/encrypter";


function makeEncryptStub(): Encrypter {
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
  const encrypterStub = makeEncryptStub();
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
})
