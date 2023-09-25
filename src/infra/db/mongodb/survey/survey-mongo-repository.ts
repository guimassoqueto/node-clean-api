import {
  type AddSurveyRepository,
  type LoadSurveyByIdRepository,
  type LoadSurveysRepository
} from '@src/data/protocols/db/survey'
import { type AddSurveyParams } from '@src/data/usecases/survey/add-survey/db-add-survey-protocols'
import { type SurveyModel } from '@src/domain/models/survey'
import { MongoHelper, QueryBuilder } from '@src/infra/db/mongodb/helpers'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository
implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const mongo = MongoHelper.getInstance()
    const surveyCollection = await mongo.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const mongo = MongoHelper.getInstance()
    const surveyCollection = await mongo.getCollection('surveys')
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)]
                }
              }
            }
          }, 1]
        }
      })
      .build()
    const surveys = await surveyCollection.aggregate(query).toArray()
    return mongo.arrayMapper<SurveyModel>(surveys)
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const mongo = MongoHelper.getInstance()
    const surveyCollection = await mongo.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })

    if (!survey) return null

    return mongo.mapper<SurveyModel>(survey)
  }
}
