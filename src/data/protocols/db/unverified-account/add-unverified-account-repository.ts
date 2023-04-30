import { type UnverifiedAccountModel } from '../../../usecases/add-unverified-account/db-add-unverified-account-protocols'

export interface AddUnverifiedAccountRepository {
  add: (accountToken: string) => Promise<UnverifiedAccountModel>
}
