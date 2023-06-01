import { type Router } from 'express'
import { expressRouteAdapter } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/surveys/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/surveys/load-surveys/load-surveys-controller-factory'
import { adminAuthorization, authorization } from '../middlewares/authorizations'

export default function (router: Router): void {
  router.post(
    '/surveys',
    adminAuthorization,
    expressRouteAdapter(makeAddSurveyController())
  )

  router.get(
    '/surveys',
    authorization,
    expressRouteAdapter(makeLoadSurveysController())
  )
}
