import { MongoHelper } from "../../src/infra/db/mongodb/helpers/mongo-helper";
import app from "../../src/main/config/app"
import request from "supertest"
import { MONGO_URL, JWT_SECRET } from "../settings";
import { Collection } from "mongodb";

import { sign } from "jsonwebtoken"

function makeAccount() {
  return {
    name: "any_name",
    email: "any_email@email.com",
    password: "any_password",
    verified: false,
    createdAt: new Date(2023, 11, 31),
  }
}

type MakeUnverifiedAccount = [ object, string ]
function makeUnverifiedAccount(accountId: string): MakeUnverifiedAccount {
  const accountToken: string = sign(accountId, JWT_SECRET)
  const unverifiedAccount: object = {
    accountToken,
    createdAt: new Date(2023, 11, 31)
  }

  return [unverifiedAccount, accountToken]
}

let accountsCollection: Collection
let unverifiedAccountsCollection: Collection
describe('Verify Account' , () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL);
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection("accounts")
    unverifiedAccountsCollection = await MongoHelper.getCollection("unverifiedAccounts")
  })

  afterEach(async () => {
    await unverifiedAccountsCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })

  test('Should return 400 if accountToken query param is not passed', async () => {
    await request(app)
      .get('/api/verify-account')
      .send()
      .expect(400)
  })

  // TODO: mudar controller para retornar outro status code?
  test('Should return 409 if accountToken is invalid', async () => {
    await request(app)
      .get('/api/verify-account')
      .query({accountToken: "invalid-token"})
      .send()
      .expect(409)
  })

  test('Should verify account if the token provided is valid', async () => {
    const account = await accountsCollection.insertOne(makeAccount())
    const [ uAccount , accountToken ] = makeUnverifiedAccount(account.insertedId.toString())
    await unverifiedAccountsCollection.insertOne(uAccount)
    let accountAdded = await accountsCollection.findOne({ _id: account.insertedId })
    expect(accountAdded?.verified).toBe(false)

    await request(app)
      .get('/api/verify-account')
      .query({ accountToken })
      .send()
      .expect(200)

    accountAdded = await accountsCollection.findOne({})
    expect(accountAdded?.verified).toBe(true)
  })
})