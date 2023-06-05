import {
  type AccountVerification,
  type Decoder,
  type Encrypter,
  type LoadAccountByIdRepository,
  type UpdateAccountVerifiedRepository,
  type DeleteUnverifiedAccountByAccountTokenRepository,
  type ChangeAccountIdRepository,
  type UpdateAccessTokenRepository
} from './db-account-verification-protocols'

export class DbAccountVerification implements AccountVerification {
  constructor (
    private readonly decoder: Decoder,
    private readonly encrypter: Encrypter,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
    private readonly updateAccountVerified: UpdateAccountVerifiedRepository,
    private readonly changeAccountId: ChangeAccountIdRepository,
    private readonly uptadeAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly deleteUnverifiedAccountByAccountToken: DeleteUnverifiedAccountByAccountTokenRepository
  ) { }

  async verify (accountToken: string): Promise<string | null> {
    const id = await this.decoder.decode(accountToken)

    const oldAccount = await this.loadAccountByIdRepository.loadById(id)
    if (!oldAccount) return null

    await this.updateAccountVerified.updateVerified(oldAccount.id, true)

    const account = await this.changeAccountId.changeId(oldAccount.id)
    if (!account) return null

    await this.deleteUnverifiedAccountByAccountToken.deleteByAccountToken(accountToken)

    const accessToken = await this.encrypter.encrypt(account.id)
    await this.uptadeAccessTokenRepository.updateAccessToken(account.id, accessToken)

    return accessToken
  }
}
