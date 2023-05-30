import { type LoadAccountByTokenRepository } from '../../protocols/db/account'
import {
  type LoadAccountByToken,
  type AccountModel,
  type Decrypter
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
    await this.decrypter.decrypt(accessToken)
    return null
  }
}
