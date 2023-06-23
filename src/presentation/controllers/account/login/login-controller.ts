import { type Authentication, type Validation } from './login-controller-protocols'
import { type Controller, type HttpRequest, type HttpResponse } from '@src/presentation/protocols'
import { serverError, ok, unauthorized, badRequest } from '@src/presentation/helpers/http/http-helper'
import { loggerConfig } from '@src/logger-config'

const logger = loggerConfig('login-controller')

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { email, password } = httpRequest.body
      const authResponse = await this.authentication.auth({ email, password })
      if (!authResponse) return unauthorized()

      return ok(authResponse)
    } catch (error) {
      logger.error(error)
      return serverError(error)
    }
  }
}
