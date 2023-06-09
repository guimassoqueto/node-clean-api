import {
  type AccountModel,
  type AddAccount,
  type AddAccountParams,
  type Hasher,
  type AddAccountRepository
} from './db-add-account-protocols'

export class DbAddAcccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })

    return account
  }
}
