import { type Controller, type HttpRequest, type HttpResponse } from './login-protocols'
import { serverError, badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email'))) })
    } catch (error) {
      return serverError(error.stack)
    }
  }
}
