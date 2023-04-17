import { type Router } from 'express'
import { makeHealthCheckController } from '../factories/healthcheck/healthcheck-factory'
import { expressRouteAdapter } from '../adapters/express'

export default function (router: Router): void {
  router.get('', expressRouteAdapter(makeHealthCheckController()))
}
