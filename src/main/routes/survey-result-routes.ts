import { type Router } from 'express'
import { expressRouteAdapter } from '@src/main/adapters/express-route-adapter'
import { anyUserAuthorization } from '@src/main/middlewares/authorizations'
import { makeSaveSurveyResultController } from '@src/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'

export default function (router: Router): void {
  router.put(
    '/surveys/:surveyId/results',
    anyUserAuthorization,
    expressRouteAdapter(makeSaveSurveyResultController())
  )
}
