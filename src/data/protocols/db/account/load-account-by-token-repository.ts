import {
  type AccountModel
} from '@src/data/usecases/account/load-account-by-token/db-load-account-by-token-protocols'

export interface LoadAccountByTokenRepository {
  loadByToken: (accessToken: string, role?: string) => Promise<AccountModel | null>
}
