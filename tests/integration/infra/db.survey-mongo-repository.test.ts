import { SurveyMongoRepository } from '../../../src/infra/db/mongodb/survey/survey-mongo-repository'
import { AddSurveyModel } from '../../../src/data/usecases/add-survey/db-add-survey-protocols'
import { MONGO_URL } from "../../settings"
import { MongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper"
import { Collection } from "mongodb"

function makeSut(): SurveyMongoRepository {
  return new SurveyMongoRepository()
}

function makeSurveyData(): AddSurveyModel {
  return {
    question: 'any-question',
    answers: [
      {
        image:'image1',
        answer: 'any-answer1'
      },
      {
        answer: 'any-answer2'
      },
    ]
  }
}

let surveyCollection: Collection
let mongo: MongoHelper 
describe('SurveyMongoRepository' , () => {
  beforeAll(async () => {
    mongo = MongoHelper.getInstance()
    await mongo.connect(MONGO_URL)
  })

  afterAll(async () => {
    await mongo.disconnect();
  })

  beforeEach(async () => {
    surveyCollection = await mongo.getCollection("surveys")
    await surveyCollection.deleteMany({})
  })

  afterEach(async () => {
    await surveyCollection.deleteMany({})
  })

  test('Should add a survey on success', async () => {
    const sut = makeSut()
    await sut.add(makeSurveyData())
    const survey = await surveyCollection.findOne({question: 'any-question'})
    expect(survey).toBeTruthy()
    expect(survey?._id).toBeTruthy()
  })
})