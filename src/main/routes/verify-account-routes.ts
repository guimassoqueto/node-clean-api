import { type Router } from 'express'
import { makeVerifyAccountController } from '../factories/verify-account/verify-account-factory'
import { expressRouteAdapter } from '../adapters/express'

export default function (router: Router): void {
  router.get('/verify-account', expressRouteAdapter(makeVerifyAccountController()))
}
