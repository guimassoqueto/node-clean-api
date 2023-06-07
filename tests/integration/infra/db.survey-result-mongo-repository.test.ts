import { SurveyResultMongoRepository } from '@src/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { MONGO_URL } from '@tests/settings'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { AddSurveyParams } from '@src/domain/usecases/survey/add-survey';
import { SurveyModel } from '@src/domain/models/survey';
import { AddAccountParams } from '@src/domain/usecases/account/add-account';
import { AccountModel } from '@src/domain/models/account';

const RealDate = Date;
class MockDate extends RealDate {
  constructor() {
    super('2030-01-01T00:00:00Z');
  }
}

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection
let mongo: MongoHelper 

function makeSurvey(): AddSurveyParams {
  return {
    createdAt: new Date(),
    question: `any-question`,
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

function makeAccount(): AddAccountParams {
  return {
    name: 'any-name',
    email: 'any-emal',
    password: 'any-password'
  }
}


async function createDbSurvey(): Promise<SurveyModel> {
  const newSurvey = await surveyCollection.insertOne(makeSurvey())
  const survey = await surveyCollection.findOne({ _id: newSurvey.insertedId })
  return mongo.mapper<SurveyModel>(survey)
}

async function createDbAccount(): Promise<AccountModel> {
  const newAccount = await accountCollection.insertOne(makeAccount())
  const account = await accountCollection.findOne({ _id: newAccount.insertedId })
  return mongo.mapper<AccountModel>(account)
}

describe('SurveyResultMongoRepository' , () => {
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
    surveyCollection = await mongo.getCollection('surveys')
    accountCollection = await mongo.getCollection('accounts')
    surveyResultCollection = await mongo.getCollection('surveyResults')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
  })

  afterEach(async () => {
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
  })

  describe('save()' , () => {
    test('Should add a survey result if its new', async () => {
      const sut = new SurveyResultMongoRepository()
      const survey = await createDbSurvey()
      const account = await createDbAccount()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        accountId: account.id,
        date: new Date(2030, 11, 31)
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toEqual(survey.answers[0].answer)
    })

    test('Should update survey result if it is not new', async () => {
      const survey = await createDbSurvey()
      const account = await createDbAccount()
      const result = await surveyResultCollection.insertOne({
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        accountId: account.id,
        date: new Date(2030, 11, 31)
      })

      const sut = new SurveyResultMongoRepository()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        answer: survey.answers[1].answer,
        accountId: account.id,
        date: new Date(2030, 11, 31)
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(result.insertedId.toString())
      expect(surveyResult.answer).toEqual(survey.answers[1].answer)
    })
  })
})