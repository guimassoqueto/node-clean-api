import { type Controller } from '@src/presentation/protocols'
import { DbLoadSurveyResult } from '@src/data/usecases/survey-result/load-survey-result/db-load-survey-result'
import { SurveyResultMongoRepository } from '@src/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { SurveyMongoRepository } from '@src/infra/db/mongodb/survey/survey-mongo-repository'
import { LoadSurveyResultController } from '@src/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'

export function makeLoadSurveyResultController (): Controller {
  const loadSurveyResultRepository = new SurveyResultMongoRepository()
  const loadSurveyByIdRepository = new SurveyMongoRepository()
  const loadSurveyById = new DbLoadSurveyResult(loadSurveyResultRepository, loadSurveyByIdRepository)
  return new LoadSurveyResultController(loadSurveyById)
}
