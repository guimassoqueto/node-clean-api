import { type AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { type AccountModel } from '../../../../domain/models/account'
import { type AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AddAccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)
    if (!result.acknowledged) throw new Error()

    const account = await accountCollection.findOne({ _id: result.insertedId })

    if (account) {
      return await new Promise(resolve => {
        resolve({
          id: account._id.toString(),
          name: account.name,
          email: account.email,
          password: account.password
        })
      })
    }

    throw new Error()
  }
}