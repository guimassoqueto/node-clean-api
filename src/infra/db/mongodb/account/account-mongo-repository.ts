import { ObjectId } from 'mongodb'
import { type AccountModel } from '../../../../domain/models/account'
import { type AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { EmailAlreadyInUseError } from '../../../../presentation/errors'
import {
  type AddAccountRepository,
  type LoadAccountByEmailRepository,
  type UpdateAccessTokenRepository,
  type LoadAccountByIdRepository,
  type UpdateAccountVerifiedRepository
} from '../../../../data/protocols/db/account'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByIdRepository, UpdateAccountVerifiedRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    // TODO: [Mudar? Assim funciona. Mas o indice é criado a cada novo signup]
    // a conta é removida do banco de dados após 600 segundos (10 minutos) se não for verificada
    await accountCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 600, partialFilterExpression: { verified: false } })

    const emailAlreadyRegistered = await accountCollection.findOne({ email: accountData.email })
    if (emailAlreadyRegistered) throw new EmailAlreadyInUseError()

    const result = await accountCollection.insertOne({ ...accountData, verified: false, createdAt: new Date() })
    const account = await accountCollection.findOne({ _id: result.insertedId })

    return MongoHelper.mapper<AccountModel>(account)
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    if (!account) return null

    return MongoHelper.mapper<AccountModel>(account)
  }

  async loadById (id: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ _id: new ObjectId(id) })
    if (!account) return null

    return MongoHelper.mapper<AccountModel>(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken: token } })
  }

  async updateVerified (id: string, verified: boolean): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { verified } })
  }
}
