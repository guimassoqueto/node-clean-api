import { type Authentication, type Validation } from './login-controller-protocols'
import { type Controller, type HttpResponse } from '@src/presentation/protocols'
import { serverError, ok, unauthorized, badRequest } from '@src/presentation/helpers/http/http-helper'
import { loggerConfig } from '@src/logger-config'

const logger = loggerConfig('login-controller')

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      const { email, password } = request
      const authResponse = await this.authentication.auth({ email, password })
      if (!authResponse) return unauthorized()

      return ok(authResponse)
    } catch (error) {
      logger.error(error)
      return serverError(error)
    }
  }
}
