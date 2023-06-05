import { type SaveSurveyResultRepository } from '@src/data/protocols/db/survey'
import { type SurveyResultModel } from '@src/domain/models/survey-result'
import { type SaveSurveyResultModel } from '@src/domain/usecases/save-survey-result'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const mongo = MongoHelper.getInstance()
    const surveyResultsCollection = await mongo.getCollection('surveyResults')
    const res = await surveyResultsCollection.findOneAndUpdate(
      { surveyId: data.surveyId, accountId: data.accountId },
      { $set: { answer: data.answer, date: data.date } },
      { upsert: true, returnDocument: 'after' }
    )
    return mongo.mapper<SurveyResultModel>(res.value)
  }
}
