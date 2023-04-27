import { type UnverifiedAccountModel } from '../models/unverified-account'

export interface AddUnverifiedAccount {
  add: (accountId: string) => Promise<UnverifiedAccountModel>
}
