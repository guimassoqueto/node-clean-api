import request from 'supertest'
import app from '@src/main/config/app'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import { JWT_SECRET, MONGO_URL } from '@tests/settings'
import { Collection, ObjectId } from 'mongodb'
import { AddSurveyModel } from '@src/domain/usecases/survey/add-survey'
import { sign } from 'jsonwebtoken'


function makeFakeSurvey(): AddSurveyModel {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'http://image-name.com',
        answer: 'any-answer'
      },
      {
        image: 'http://image2-name2.com',
        answer: 'any-answer2'
      }
    ],
    createdAt: new Date()
  }
}

async function makeAccessToken(isAdmin: boolean = false): Promise<string> {
  const fakeAccount = {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
  }

  if (isAdmin) fakeAccount['role'] = 'ADMIN'

  const account = await accountCollection.insertOne(fakeAccount)
  const id = account.insertedId.toString()
  const accessToken = sign(id, JWT_SECRET)
  await accountCollection.updateOne({_id: new ObjectId(id)}, { $set: { accessToken } })

  return accessToken
}

let surveyCollection: Collection
let accountCollection: Collection
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

    test('Should return 200 on save survey result with access token', async () => {
      const accessToken = await makeAccessToken(false)
      const survey = (await surveyCollection.insertOne(makeFakeSurvey()))
      const surveyId = survey.insertedId.toString()

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any-answer2'
        })
        .expect(200)
    })
  
  })
})
