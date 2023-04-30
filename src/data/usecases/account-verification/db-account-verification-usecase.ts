import {
  type AccountVerification,
  type Decrypter,
  type LoadAccountByIdRepository,
  type UpdateAccountVerifiedRepository,
  type DeleteUnverifiedAccountByAccountTokenRepository
} from './db-account-verification-protocols'

export class DbAccountVerification implements AccountVerification {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
    private readonly updateAccountVerified: UpdateAccountVerifiedRepository,
    private readonly deleteUnverifiedAccountByAccountToken: DeleteUnverifiedAccountByAccountTokenRepository
  ) { }

  async verify (accountToken: string): Promise<boolean> {
    const { id } = await this.decrypter.decrypt(accountToken)

    const account = await this.loadAccountByIdRepository.loadById(id)
    if (!account) return false

    await this.updateAccountVerified.updateVerified(account.id, true)

    await this.deleteUnverifiedAccountByAccountToken.deleteByAccountToken(accountToken)

    return true
  }
}
