import {
  type AddSurveyRepository,
  type LoadSurveysRepository,
  type LoadSurveyByIdRepository
} from '@src/data/protocols/db/survey'
import { type AddSurveyParams } from '@src/data/usecases/survey/add-survey/db-add-survey-protocols'
import { type SurveyModel } from '@src/domain/models/survey'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const mongo = MongoHelper.getInstance()
    const surveyCollection = await mongo.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const mongo = MongoHelper.getInstance()
    const surveyCollection = await mongo.getCollection('surveys')
    const allSurveys = await surveyCollection.find().toArray()

    return mongo.arrayMapper<SurveyModel>(allSurveys)
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const mongo = MongoHelper.getInstance()
    const surveyCollection = await mongo.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })

    if (!survey) return null

    return mongo.mapper<SurveyModel>(survey)
  }
}
