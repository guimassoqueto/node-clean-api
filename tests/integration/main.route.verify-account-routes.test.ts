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
function makeUnverifiedAccount(accountId: {id: string}): MakeUnverifiedAccount {
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


})