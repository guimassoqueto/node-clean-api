import {
  type AccountModel
} from '../../../usecases/load-account-by-token/db-load-account-by-token-protocols'

export interface LoadAccountByTokenRepository {
  load: (accessToken: string, role?: string) => Promise<AccountModel | null>
}
