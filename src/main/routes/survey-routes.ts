import { type Router } from 'express'
import { expressRouteAdapter } from '../adapters/express-route-adapter'
import { expressMiddlewareAdapter } from '../adapters/express-middleware-adapter'
import { makeAddSurveyController } from '../factories/controllers/surveys/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/surveys/load-surveys/load-surveys-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

const adminAccess = expressMiddlewareAdapter(makeAuthMiddleware('ADMIN'))

export default function (router: Router): void {
  router.post(
    '/surveys',
    adminAccess,
    expressRouteAdapter(makeAddSurveyController())
  )

  router.get(
    '/surveys',
    adminAccess,
    expressRouteAdapter(makeLoadSurveysController())
  )
}
