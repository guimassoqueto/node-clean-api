import request from "supertest"
import app from "../../src/main/config/app"
import { MongoHelper } from "../../src/infra/db/mongodb/helpers/mongo-helper"
import { MONGO_URL, SALT_ROUNDS } from "../settings"
import { Collection } from "mongodb"
import { hash } from "bcrypt"

let accountCollection: Collection;
describe('Login Route' , () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL);
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  afterEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts")
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

  describe('POST /signup' , () => {
    test('Should return 409 on second signup with an already registered email', async () => {
      const email = "any_email@email.com"
      // first try should return 200
      await request(app)
        .post('/api/signup')
        .send({
          name: "Guilherme",
          email,
          password: "###!!!123GGGaaa",
          passwordConfirmation: "###!!!123GGGaaa"
        })
        .expect(200)

      // second try should return 409
      await request(app)
        .post('/api/signup')
        .send({
          name: "Guilherme",
          email,
          password: "###!!!123GGGaaa",
          passwordConfirmation: "###!!!123GGGaaa"
        })
        .expect(409)
        
        // certifica que apenas a primeira inserção foi adicionada ao banco
        const accounts = await accountCollection.countDocuments({ email })
        expect(accounts).toBe(1)
    })
  })

  describe('POST /login' , () => {
    test('Should return 200 on login', async () => {
      const rawPassword = "321!@#qweEWQ"
      const passwordHash = await hash(rawPassword, SALT_ROUNDS)

      const newUser: { name: string, email: string, password: string } = {
        name: "any_user",
        email: "any_email@email.com",
        password: passwordHash
      }

      await accountCollection.insertOne(newUser)

      await request(app)
        .post('/api/login')
        .send({
          email: newUser.email,
          password: rawPassword
        })
        .expect(200)
    })

    test('Should return 401 on invalid credentials', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: "inexistent_email@email.com",
          password: "4sd35gf354dfs$#%#$SDgvf"
        })
        .expect(401)
    })
  })
  
})
