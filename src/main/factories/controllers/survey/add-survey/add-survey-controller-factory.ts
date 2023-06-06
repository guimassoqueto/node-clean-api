import { type Controller } from '@src/presentation/protocols'
import { AddSurveyController } from '@src/presentation/controllers/survey/add-survey/add-survey-controller'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { SurveyMongoRepository } from '@src/infra/db/mongodb/survey/survey-mongo-repository'
import { DbAddSurvey } from '@src/data/usecases/survey/add-survey/db-add-survey'

export function makeAddSurveyController (): Controller {
  const validations = makeAddSurveyValidation()
  const addSurveyRepository = new SurveyMongoRepository()
  const dbAddSurvey = new DbAddSurvey(addSurveyRepository)
  return new AddSurveyController(validations, dbAddSurvey)
}
