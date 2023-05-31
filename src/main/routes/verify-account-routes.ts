import { type Router } from 'express'
import { makeVerifyAccountController } from '../factories/user/verify-account/verify-account-factory'
import { expressRouteAdapter } from '../adapters/express-route-adapter'

export default function (router: Router): void {
  router.get('/verify-account', expressRouteAdapter(makeVerifyAccountController()))
}
