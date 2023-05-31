import { type Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { makeLoginController } from '../factories/user/login/login-factory'
import { expressRouteAdapter } from '../adapters/express-route-adapter'

export default function (router: Router): void {
  router.post('/signup', expressRouteAdapter(makeSignUpController()))
  router.post('/login', expressRouteAdapter(makeLoginController()))
}
