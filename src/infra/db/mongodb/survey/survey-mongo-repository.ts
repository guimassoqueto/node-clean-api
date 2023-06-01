import { type AddSurveyRepository, type LoadSurveysRepository } from '../../../../data/protocols/db/survey'
import { type AddSurveyModel } from '../../../../data/usecases/add-survey/db-add-survey-protocols'
import { type SurveyModel } from '../../../../domain/models/survey'
import { MongoHelper } from '../../../db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const mongo = MongoHelper.getInstance()
    const surveyCollection = await mongo.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const mongo = MongoHelper.getInstance()
    const surveyCollection = await mongo.getCollection('surveys')
    const allSurveys = await surveyCollection.find().toArray()
    return allSurveys.map((survey) => {
      return mongo.mapper<SurveyModel>(survey)
    })
  }
}
