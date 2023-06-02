import { type Controller } from '@src/presentation/protocols'
import { LoadSurveysController } from '@src/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { DbLoadSurveys } from '../../../../../data/usecases/load-surveys/db-load-surveys'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'

export function makeLoadSurveysController (): Controller {
  const loadSurveysRepository = new SurveyMongoRepository()
  const loadSurveys = new DbLoadSurveys(loadSurveysRepository)
  return new LoadSurveysController(loadSurveys)
}
