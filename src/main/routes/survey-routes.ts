import { type Router } from 'express'
import { expressRouteAdapter } from '../adapters/express-route-adapter'
import { expressMiddlewareAdapter } from '../adapters/express-middleware-adapter'
import { makeAddSurveyController } from '../factories/controllers/surveys/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default function (router: Router): void {
  router.post(
    '/surveys',
    expressMiddlewareAdapter(makeAuthMiddleware('ADMIN')),
    expressRouteAdapter(makeAddSurveyController())
  )
}
