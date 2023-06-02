import { type Router } from 'express'
import { makeHealthCheckController } from '@src/main/factories/controllers/healthcheck/healthcheck-controller-factory'
import { expressRouteAdapter } from '@src/main/adapters/express-route-adapter'

export default function (router: Router): void {
  router.get('', expressRouteAdapter(makeHealthCheckController()))
}
