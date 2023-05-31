import { type Router } from 'express'
import { makeHealthCheckController } from '../factories/controllers/healthcheck/healthcheck-controller-factory'
import { expressRouteAdapter } from '../adapters/express-route-adapter'

export default function (router: Router): void {
  router.get('', expressRouteAdapter(makeHealthCheckController()))
}
