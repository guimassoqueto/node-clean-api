import request from "supertest"
import app from "../../src/main/config/app"
import { MongoHelper } from "../../src/infra/db/mongodb/helpers/mongo-helper"
import { MONGO_URL_STG } from "../../src/settings"


describe('SignUp Route' , () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL_STG);
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  afterEach(async () => {
    const accountCollection = MongoHelper.getCollection("accounts")
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: "Guilherme",
        email: "guilhermemassoqueto@gmail.com",
        password: "###!!!123GGGaaa",
        passwordConfirmation: "###!!!123GGGaaa"
      })
      .expect(200)
  })
})
