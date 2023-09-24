import { ObjectId } from 'mongodb'
import { type AccountModel } from '@src/domain/models/account'
import { type AddAccountParams } from '@src/domain/usecases/account/add-account'
import { MongoHelper } from '@src/infra/db/mongodb/helpers'
import { EmailAlreadyInUseError } from '@src/errors'
import {
  type AddAccountRepository,
  type LoadAccountByEmailRepository,
  type LoadAccountByIdRepository,
  type LoadAccountByTokenRepository,
  type UpdateAccessTokenRepository
} from '@src/data/protocols/db/account'

export class AccountMongoRepository
implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    LoadAccountByTokenRepository,
    UpdateAccessTokenRepository,
    LoadAccountByIdRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const mongo = MongoHelper.getInstance()
    const accountCollection = await mongo.getCollection('accounts')

    const emailAlreadyRegistered = await accountCollection.findOne({
      email: accountData.email
    })
    if (emailAlreadyRegistered) throw new EmailAlreadyInUseError()

    const result = await accountCollection.insertOne({
      ...accountData,
      createdAt: new Date()
    })
    const account = await accountCollection.findOne({ _id: result.insertedId })

    return mongo.mapper<AccountModel>(account)
  }

  async loadByToken (
    accessToken: string,
    role?: string | undefined
  ): Promise<AccountModel | null> {
    const mongo = MongoHelper.getInstance()
    const accountCollection = await mongo.getCollection('accounts')

    // TODO: mudar a funcionalidade de acrdo com o nível de acesso da conta, assim está ruim
    // relacionado ao teste: https://vscode.dev/github/guimassoqueto/node-clean-api/blob/feat/add-survey/tests/integration/infra/db.account-mongo-repository.test.ts#L174
    const account = await accountCollection.findOne({
      accessToken,
      $or: [{ role }, { role: 'ADMIN' }]
    })

    if (!account) return null

    return mongo.mapper<AccountModel>(account)
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const mongo = MongoHelper.getInstance()
    const accountCollection = await mongo.getCollection('accounts')

    const account = await accountCollection.findOne({ email })
    if (!account) return null

    return mongo.mapper<AccountModel>(account)
  }

  async loadById (id: string): Promise<AccountModel | null> {
    const mongo = MongoHelper.getInstance()
    const accountCollection = await mongo.getCollection('accounts')

    const account = await accountCollection.findOne({ _id: new ObjectId(id) })
    if (!account) return null

    return mongo.mapper<AccountModel>(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const mongo = MongoHelper.getInstance()
    const accountCollection = await mongo.getCollection('accounts')

    await accountCollection.updateOne({ _id: new ObjectId(id) }, {
      $set: { accessToken: token }
    })
  }
}
