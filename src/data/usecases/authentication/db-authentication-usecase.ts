import { type LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { type Authentication, type AuthenticationModel } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    await this.loadAccountByEmailRepository.load(authentication.email)

    return null
  }
}
