import request from "supertest"
import app from "../../../src/main/config/app"
import { MongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper"
import { MONGO_URL } from "../../settings"
import { Collection } from "mongodb"

function makeFakeSurvey() {
  return {
    question: 'any_question',
    answers: [
      {
        image: "http://image-name.com",
        answer: "any-answer"
      },
      {
        image: "http://image2-name2.com",
        answer: "any-answer2"
      }
    ]
  }
}


let surveyCollection: Collection;
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
    surveyCollection = await mongo.getCollection("accounts")
    await surveyCollection.deleteMany({})
  })


  test('Should return 403 if user did not provide a valid accessToken', async () => {
    await request(app)
      .post('/api/surveys')
      .send(makeFakeSurvey())
      .expect(403)
  })
})
