import { type LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { type TokenGenerator, type Authentication, type AuthenticationModel, type HashComparer } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return null

    const isMatch = await this.hashComparer.compare(authentication.password, account.password)
    if (!isMatch) return null

    const Accesstoken = await this.tokenGenerator.generate(account.id)

    return Accesstoken
  }
}
