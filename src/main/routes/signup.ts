import { type Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { expressRouteAdapter } from '../adapters/express'

export default function (router: Router): void {
  router.post('/signup', expressRouteAdapter(makeSignUpController()))
}
