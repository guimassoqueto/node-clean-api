import { type Router } from 'express'
import { expressRouteAdapter } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/surveys/add-survey/add-survey-controller-factory'

export default function (router: Router): void {
  router.post('/surveys', expressRouteAdapter(makeAddSurveyController()))
}
