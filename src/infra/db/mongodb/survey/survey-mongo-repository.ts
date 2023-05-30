import { type AddSurveyRepository } from '../../../../data/protocols/db/add-survey'
import { type AddSurveyModel } from '../../../../data/usecases/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../../../db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const mongo = MongoHelper.getInstance()
    const surveyCollection = await mongo.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}
