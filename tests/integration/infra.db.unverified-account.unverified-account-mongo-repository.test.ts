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


})
