import { AccountModel } from "@src/domain/models/account";
import { faker } from "@faker-js/faker"
import { AddAccountParams } from "@src/domain/usecases/account/add-account";
import { AddAccountRepository } from "@src/data/protocols/db/account";

export function mockAccountModel(): AccountModel {
  return {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    createdAt: new Date()
  }
}

export function mockAddAccountParams(): AddAccountParams {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

export class AddAccountRepositorySpy implements AddAccountRepository {
  accountData: AddAccountParams
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    this.accountData = accountData
    return {
      id: faker.string.uuid(),
      name: accountData.name,
      email: accountData.email,
      createdAt: new Date(),
      password: accountData.email
    }
  }
}
