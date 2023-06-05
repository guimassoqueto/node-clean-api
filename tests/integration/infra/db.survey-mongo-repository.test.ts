import { SurveyMongoRepository } from '@src/infra/db/mongodb/survey/survey-mongo-repository'
import { AddSurveyModel } from '@src/data/usecases/add-survey/db-add-survey-protocols'
import { MONGO_URL } from "@tests/settings"
import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper"
import { Collection } from "mongodb"

const RealDate = Date;
class MockDate extends RealDate {
  constructor() {
    super('2030-01-01T00:00:00Z');
  }
}

function makeSurveyData(questionNumber: number): AddSurveyModel {
  return {
    createdAt: new Date(),
    question: `any-question${questionNumber}`,
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
    (global as any).Date = MockDate;
    mongo = MongoHelper.getInstance()
    await mongo.connect(MONGO_URL)
  })

  afterAll(async () => {
    (global as any).Date = RealDate;
    await mongo.disconnect();
  })

  beforeEach(async () => {
    surveyCollection = await mongo.getCollection("surveys")
    await surveyCollection.deleteMany({})
  })

  afterEach(async () => {
    await surveyCollection.deleteMany({})
  })

  describe('add()' , () => {
    test('Should add a survey on success', async () => {
      const sut = new SurveyMongoRepository()
      await sut.add(makeSurveyData(1))
      const survey = await surveyCollection.findOne({question: 'any-question1'})
      expect(survey).toBeTruthy()
      expect(survey?._id).toBeTruthy()
    })
  })
  
  describe('loadAll()' , () => {
    test('Should return a correct quantity of Surveys on loadAll success', async () => {
      await surveyCollection.insertMany([ makeSurveyData(0), makeSurveyData(1) ])
      const sut = new SurveyMongoRepository()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toEqual('any-question0')
      expect(surveys[1].question).toEqual('any-question1')
    })

    test('Should return a empty list loadAll if there is no Surveys on DB', async () => {
      const sut = new SurveyMongoRepository()
      const surveys = await sut.loadAll()
      expect(surveys).toStrictEqual([])
      expect(surveys.length).toStrictEqual(0)
    })
  })

  describe('loadById()' , () => {
    test('Should load a survey on loadById success', async () => {
      const newSurvey = await surveyCollection.insertOne(makeSurveyData(1))
      const newSurveyId = newSurvey.insertedId.toString()
      const sut = new SurveyMongoRepository()
      const survey = await sut.loadById(newSurveyId)

      expect(survey).toBeTruthy()
    })
  })
})