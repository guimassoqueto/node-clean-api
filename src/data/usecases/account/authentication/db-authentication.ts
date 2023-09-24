import {
  type LoadAccountByEmailRepository,
  type Encrypter,
  type Authentication,
  type AuthenticationParams,
  type HashComparer,
  type UpdateAccessTokenRepository,
  type AuthenticationResponse
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly uptadeAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationParams): Promise<AuthenticationResponse | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (!account) return null

    const isMatch = await this.hashComparer.compare(authentication.password, account.password)
    if (!isMatch) return null

    const accessToken = await this.encrypter.encrypt(account.id)

    await this.uptadeAccessTokenRepository.updateAccessToken(account.id, accessToken)

    return { accessToken, userName: account.name }
  }
}
