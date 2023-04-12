import {
  type LoadAccountByEmailRepository,
  type TokenGenerator,
  type Authentication,
  type AuthenticationModel,
  type HashComparer,
  type UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly uptadeAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return null

    const isMatch = await this.hashComparer.compare(authentication.password, account.password)
    if (!isMatch) return null

    const token = await this.tokenGenerator.generate(account.id)

    await this.uptadeAccessTokenRepository.update(account.id, token)

    return token
  }
}
