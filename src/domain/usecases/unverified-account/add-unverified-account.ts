import { type UnverifiedAccountModel } from '@src/domain/models/unverified-account'

export interface AddUnverifiedAccount {
  add: (accountId: string) => Promise<UnverifiedAccountModel>
}
