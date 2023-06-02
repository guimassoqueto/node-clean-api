import { type AddAccountModel, type AccountModel } from '@src/data/usecases/add-account/db-add-account-protocols'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
