import { ObjectId, type WithId } from 'mongodb'
import { type AccountModel } from '@src/domain/models/account'
import { type AddAccountModel } from '@src/domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { EmailAlreadyInUseError } from '../../../../errors'
import {
  type AddAccountRepository,
  type LoadAccountByEmailRepository,
  type LoadAccountByTokenRepository,
  type UpdateAccessTokenRepository,
  type LoadAccountByIdRepository,
  type UpdateAccountVerifiedRepository,
  type ChangeAccountIdRepository
} from '@src/data/protocols/db/account'

export class AccountMongoRepository implements
AddAccountRepository,
LoadAccountByEmailRepository,
LoadAccountByTokenRepository,
UpdateAccessTokenRepository,
LoadAccountByIdRepository,
UpdateAccountVerifiedRepository,
ChangeAccountIdRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const mongo = MongoHelper.getInstance()
    const accountCollection = await mongo.getCollection('accounts')

    // TODO: [Mudar? Assim funciona. Mas o indice é criado a cada novo signup]
    // a conta é removida do banco de dados após 600 segundos (10 minutos) se não for verificada
    await accountCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 600, partialFilterExpression: { verified: false } })

    const emailAlreadyRegistered = await accountCollection.findOne({ email: accountData.email })
    if (emailAlreadyRegistered) throw new EmailAlreadyInUseError()

    const result = await accountCollection.insertOne({ ...accountData, verified: false, createdAt: new Date() })
    const account = await accountCollection.findOne({ _id: result.insertedId })

    return mongo.mapper<AccountModel>(account)
  }

  async loadByToken (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
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

    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken: token } })
  }

  async updateVerified (id: string, verified: boolean): Promise<void> {
    const mongo = MongoHelper.getInstance()
    const accountCollection = await mongo.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { verified } })
  }

  async changeId (id: string): Promise<AccountModel | null> {
    const mongo = MongoHelper.getInstance()
    const accountCollection = await mongo.getCollection('accounts')

    const oldAccount = await accountCollection.findOne({ _id: new ObjectId(id) })
    await accountCollection.findOneAndDelete({ _id: new ObjectId(id) })

    const { _id, ...rest } = oldAccount as WithId<Document>
    const insertedAccount = await accountCollection.insertOne(rest)

    const account = await accountCollection.findOne({ _id: insertedAccount.insertedId })

    return mongo.mapper<AccountModel>(account)
  }
}
