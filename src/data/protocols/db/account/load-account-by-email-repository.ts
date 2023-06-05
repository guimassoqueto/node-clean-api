import { type AccountModel } from '@src/data/usecases/account/authentication/db-authentication-protocols'

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<AccountModel | null >
}
