import { type AccountModel } from '@src/domain/models/account'

export type AddAccountParams = Omit<AccountModel, 'id' | 'verified' | 'createdAt'>

export interface AddAccount {
  add: (account: AddAccountParams) => Promise<AccountModel>
}
