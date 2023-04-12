import { type Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default function (router: Router): void {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
