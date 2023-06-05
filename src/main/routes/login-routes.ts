import { type Router } from 'express'
import { makeSignUpController } from '@src/main/factories/controllers/account/signup/signup-controller-factory'
import { makeLoginController } from '@src/main/factories/controllers/account/login/login-controller-factory'
import { expressRouteAdapter } from '@src/main/adapters/express-route-adapter'

export default function (router: Router): void {
  router.post('/signup', expressRouteAdapter(makeSignUpController()))
  router.post('/login', expressRouteAdapter(makeLoginController()))
}
