import { MONGO_URL } from '@tests/settings'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import { UnverifiedAccountMongoRepository } from '@src/infra/db/mongodb/unverified-account/unverified-account-mongo-repository'
import { Collection, ObjectId } from 'mongodb'

function makeAccountToken(accountToken: string = 'encripted_account_id'): string {
  return accountToken
}

function makeSut(): UnverifiedAccountMongoRepository {
  return new UnverifiedAccountMongoRepository()
}

let unverifiedAccountCollection: Collection
let mongo: MongoHelper
describe('Add Unverified Account Mongo Repository', () => {
  beforeAll(async () => {
    mongo = MongoHelper.getInstance()
    await mongo.connect(MONGO_URL)
  })

  afterAll(async () => {
    await mongo.disconnect();
  })

  afterEach(async () => {
    unverifiedAccountCollection = await mongo.getCollection('unverifiedAccounts')
    await unverifiedAccountCollection.deleteMany({})
  })

  test('Should return unverifiedAccount', async () => {
    const sut = makeSut()
    const unverifiedAccount = await sut.add(makeAccountToken('some-random-token'))

    expect(unverifiedAccount).toBeTruthy()
    expect(unverifiedAccount.accountToken).toBe('some-random-token')
    expect(unverifiedAccount.id).toBeTruthy()
  })

  test('Should insert unverifiedAccount corretly in the database', async () => {
    const sut = makeSut()
    const res = await sut.add(makeAccountToken('some-random-token'))
    const accountMongo = await unverifiedAccountCollection.findOne({ _id: new ObjectId(res.id)})    
    
    expect(accountMongo).toBeTruthy()
    expect(accountMongo?._id.toString()).toEqual(res.id)
    expect(accountMongo?.accountToken).toEqual(res.accountToken)
  }) 

  test('Should delete unverifiedAccount corretly from the database', async () => {
    const sut = makeSut()
    const accountToken = 'some-random-token'
    await sut.add(makeAccountToken(accountToken))

    let accountMongo = await unverifiedAccountCollection.findOne({ accountToken })
    expect(accountMongo).toBeTruthy()

    await sut.deleteByAccountToken(accountToken)
    accountMongo = await unverifiedAccountCollection.findOne({ accountToken })
    expect(accountMongo).toBe(null)
  })

})
