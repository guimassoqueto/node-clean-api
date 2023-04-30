import { type AccountModel } from '../../../usecases/authentication/db-authentication-protocols'

export interface LoadAccountByIdRepository {
  loadById: (id: string) => Promise<AccountModel | null >
}
