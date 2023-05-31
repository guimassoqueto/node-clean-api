import { type Router } from 'express'
import { makeSignUpController } from '../factories/controllers/user/signup/signup-controller-factory'
import { makeLoginController } from '../factories/controllers/user/login/login-controller-factory'
import { expressRouteAdapter } from '../adapters/express-route-adapter'

export default function (router: Router): void {
  router.post('/signup', expressRouteAdapter(makeSignUpController()))
  router.post('/login', expressRouteAdapter(makeLoginController()))
}
