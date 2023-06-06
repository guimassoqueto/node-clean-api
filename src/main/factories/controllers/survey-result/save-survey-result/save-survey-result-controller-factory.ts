import { type Controller } from '@src/presentation/protocols'
import { SaveSurveyResultController } from '@src/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { DbLoadSurveyById } from '@src/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { SurveyMongoRepository } from '@src/infra/db/mongodb/survey/survey-mongo-repository'
import { DbSaveSurveyResult } from '@src/data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '@src/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export function makeSaveSurveyResultController (): Controller {
  const loadSurveyByIdRepository = new SurveyMongoRepository()
  const loadSurveyById = new DbLoadSurveyById(loadSurveyByIdRepository)
  const saveSurveyResultRepository = new SurveyResultMongoRepository()
  const saveSurveyResult = new DbSaveSurveyResult(saveSurveyResultRepository)

  return new SaveSurveyResultController(loadSurveyById, saveSurveyResult)
}
