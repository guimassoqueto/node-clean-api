import request from 'supertest'
import app from '@src/main/config/app'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import {  MONGO_URL } from '@tests/settings'
import { Collection } from 'mongodb'


let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection
let mongo: MongoHelper
describe('Surveys Route', () => {
  beforeAll(async () => {
    mongo = MongoHelper.getInstance()
    await mongo.connect(MONGO_URL)
  })

  afterAll(async () => {
    await mongo.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await mongo.getCollection('surveys')
    accountCollection = await mongo.getCollection('accounts')
    surveyResultCollection = await mongo.getCollection('surveyResults')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results' , () => {
    test('Should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any-answer'
        })
        .expect(403)
    })
  
  })
})
