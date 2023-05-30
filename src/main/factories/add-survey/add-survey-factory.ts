import { type Controller } from '../../../presentation/protocols'
import { AddSurveyController } from '../../../presentation/controllers/survey/add-survey-controller'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { SurveyMongoRepository } from '../../../infra/db/mongodb/survey/survey-mongo-repository'
import { DbAddSurvey } from '../../../data/usecases/add-survey/db-add-survey-usecase'

export function makeAddSurveyController (): Controller {
  const validations = makeAddSurveyValidation()
  const addSurveyRepository = new SurveyMongoRepository()
  const dbAddSurvey = new DbAddSurvey(addSurveyRepository)
  return new AddSurveyController(validations, dbAddSurvey)
}
