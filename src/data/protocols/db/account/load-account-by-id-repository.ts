import { type AccountModel } from '@src/data/usecases/account/authentication/db-authentication-protocols'

export interface LoadAccountByIdRepository {
  loadById: (id: string) => Promise<AccountModel | null >
}
