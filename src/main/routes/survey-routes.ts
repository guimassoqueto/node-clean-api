import { type Router } from 'express'
import { expressRouteAdapter } from '../adapters/express'
import { makeAddSurveyController } from '../factories/add-survey/add-survey-factory'

export default function (router: Router): void {
  router.post('/surveys', expressRouteAdapter(makeAddSurveyController()))
}
