import request from "supertest"
import app from "../../src/main/config/app"
import { MongoHelper } from "../../src/infra/db/mongodb/helpers/mongo-helper"
import { MONGO_URL } from "../settings"


describe('Login Route' , () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL);
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  afterEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts")
    await accountCollection.deleteMany({})
  })

  describe('POST /signup' , () => {
    test('Should return 200 on signup', async () => {
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
  
})
