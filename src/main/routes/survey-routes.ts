import { type Router } from 'express'
import { expressRouteAdapter } from '@src/main/adapters/express-route-adapter'
import { makeAddSurveyController } from '@src/main/factories/controllers/surveys/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '@src/main/factories/controllers/surveys/load-surveys/load-surveys-controller-factory'
import { adminAuthorization, anyUserAuthorization } from '@src/main/middlewares/authorizations'

export default function (router: Router): void {
  router.post(
    '/surveys',
    adminAuthorization,
    expressRouteAdapter(makeAddSurveyController())
  )

  router.get(
    '/surveys',
    anyUserAuthorization,
    expressRouteAdapter(makeLoadSurveysController())
  )
}
