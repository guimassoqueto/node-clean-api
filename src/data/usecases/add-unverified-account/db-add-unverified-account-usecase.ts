import {
  type UnverifiedAccountModel,
  type AddUnverifiedAccount,
  type AddUnverifiedAccountRepository,
  type Encrypter
} from './db-add-unverified-account-protocols'

export class DbAddUnverifiedAcccount implements AddUnverifiedAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addUnverifiedAccountRepository: AddUnverifiedAccountRepository
  ) {}

  async add (accountId: string): Promise<UnverifiedAccountModel> {
    const encryptedAccountId = await this.encrypter.encrypt(accountId)
    const unverifiedAccount = await this.addUnverifiedAccountRepository.add(encryptedAccountId)
    return unverifiedAccount
  }
}
