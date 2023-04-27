import { MONGO_URL } from "../settings"
import { MongoHelper } from "../../src/infra/db/mongodb/helpers/mongo-helper"
import { UnverifiedAccountMongoRepository } from "../../src/infra/db/mongodb/account/unverified-account-mongo-repository"
import { Collection } from "mongodb"

function makeEncriptedAccountId(): string {
  return "encripted_account_id"
}

function makeSut(): UnverifiedAccountMongoRepository {
  return new UnverifiedAccountMongoRepository()
}

let accountCollection: Collection
describe('Add Unverified Account Mongo Repository' , () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL);
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  afterEach(async () => {
    accountCollection = await MongoHelper.getCollection("unverifiedAccounts")
    await accountCollection.deleteMany({})
  })

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const encriptedAccountId = makeEncriptedAccountId()
    const unverifiedAccount = await sut.add(encriptedAccountId)

    expect(unverifiedAccount).toBeTruthy()
    expect(unverifiedAccount.encryptedAccountId).toEqual(encriptedAccountId)
  })

})
