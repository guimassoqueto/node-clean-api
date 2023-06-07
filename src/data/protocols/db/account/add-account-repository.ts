import { type AddAccountParams, type AccountModel } from '@src/data/usecases/account/add-account/db-add-account-protocols'

export interface AddAccountRepository {
  add: (accountData: AddAccountParams) => Promise<AccountModel>
}
