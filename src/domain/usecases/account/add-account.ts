import { type AccountModel } from '@src/domain/models/account'

export type AddAccountModel = Omit<AccountModel, 'id' | 'verified' | 'createdAt'>

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
