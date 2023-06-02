import {
  type AddUnverifiedAccountRepository,
  type DeleteUnverifiedAccountByAccountTokenRepository
} from '@src/data/protocols/db/unverified-account'
import { type UnverifiedAccountModel } from '@src/data/usecases/add-unverified-account/db-add-unverified-account-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class UnverifiedAccountMongoRepository implements AddUnverifiedAccountRepository, DeleteUnverifiedAccountByAccountTokenRepository {
  async add (accountToken: string): Promise<UnverifiedAccountModel> {
    const mongo = MongoHelper.getInstance()
    const unverifiedAccountCollection = await mongo.getCollection('unverifiedAccounts')

    // TODO: [Mudar? Assim funciona. Mas o indice é criado a cada novo signup]
    // a hash é removida do banco de dados após 600 segundos (10 minutos) se não for verificada
    await unverifiedAccountCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 600 })

    const result = await unverifiedAccountCollection.insertOne({ accountToken, createdAt: new Date() })
    const unverifiedAccount = await unverifiedAccountCollection.findOne({ _id: result.insertedId })

    return mongo.mapper<UnverifiedAccountModel>(unverifiedAccount)
  }

  async deleteByAccountToken (accountToken: string): Promise<void> {
    const mongo = MongoHelper.getInstance()
    const unverifiedAccountCollection = await mongo.getCollection('unverifiedAccounts')
    await unverifiedAccountCollection.deleteOne({ accountToken })
  }
}
