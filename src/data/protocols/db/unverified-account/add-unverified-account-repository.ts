import { type UnverifiedAccountModel } from '@src/data/usecases/unverified-account/add-unverified-account/db-add-unverified-account-protocols'

export interface AddUnverifiedAccountRepository {
  add: (accountToken: string) => Promise<UnverifiedAccountModel>
}
