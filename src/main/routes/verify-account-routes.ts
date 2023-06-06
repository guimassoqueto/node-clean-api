import { type Router } from 'express'
import { makeVerifyAccountController } from '@src/main/factories/controllers/account/verify-account/verify-account-controller-factory'
import { expressRouteAdapter } from '@src/main/adapters/express-route-adapter'

export default function (router: Router): void {
  router.get('/verify-account', expressRouteAdapter(makeVerifyAccountController()))
}
