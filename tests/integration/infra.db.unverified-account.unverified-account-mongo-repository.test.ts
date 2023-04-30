import { MONGO_URL } from "../settings"
import { MongoHelper } from "../../src/infra/db/mongodb/helpers/mongo-helper"
import { UnverifiedAccountMongoRepository } from "../../src/infra/db/mongodb/unverified-account/unverified-account-mongo-repository"
import { Collection, ObjectId } from "mongodb"

function makeAccountToken(accountToken: string = "encripted_account_id"): string {
  return accountToken
}

function makeSut(): UnverifiedAccountMongoRepository {
  return new UnverifiedAccountMongoRepository()
}

let unverifiedAccountCollection: Collection
describe('Add Unverified Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL);
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  afterEach(async () => {
    unverifiedAccountCollection = await MongoHelper.getCollection("unverifiedAccounts")
    await unverifiedAccountCollection.deleteMany({})
  })

  test('Should return unverifiedAccount', async () => {
    const sut = makeSut()
    const unverifiedAccount = await sut.add(makeAccountToken("some-random-token"))

    expect(unverifiedAccount).toBeTruthy()
    expect(unverifiedAccount.accountToken).toBe("some-random-token")
    expect(unverifiedAccount.id).toBeTruthy()
  })

  test('Should insert unverifiedAccount corretly in the database', async () => {
    const sut = makeSut()
    const res = await sut.add(makeAccountToken("some-random-token"))
    const accountMongo = await unverifiedAccountCollection.findOne({ _id: new ObjectId(res.id)})    
    
    expect(accountMongo).toBeTruthy()
    expect(accountMongo?._id.toString()).toEqual(res.id)
    expect(accountMongo?.accountToken).toEqual(res.accountToken)
  }) 
})