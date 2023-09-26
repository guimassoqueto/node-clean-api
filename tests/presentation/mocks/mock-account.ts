import { AccountModel } from "@src/domain/models/account"
import { LoadAccountByToken } from "@src/domain/usecases/account/load-account-by-token"
import { faker } from "@faker-js/faker"
import { AddAccount, AddAccountParams } from "@src/domain/usecases/account/add-account"

export function mockAccountModel(): AccountModel {
  return {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    createdAt: new Date()
  }
}

function mockAddAccountParams(): AddAccountParams {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role: string
  result: AccountModel | null = mockAccountModel()

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    this.accessToken = accessToken
    if (role) {
      this.role = role
    }
    return this.result
  }
}

export class AddAccountSpy implements AddAccount {
  account: AddAccountParams
  result = mockAccountModel()
  async add (account: AddAccountParams): Promise<AccountModel> {
    this.account = account
    return this.result
  }
}