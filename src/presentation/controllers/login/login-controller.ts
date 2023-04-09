import { type Controller, type HttpRequest, type HttpResponse } from './login-protocols'
import { serverError, badRequest, ok } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields: string[] = ['email', 'password']

      // checa se os campos obrigatórios esperados estão presentes no corpo da requisição
      for (const field of requiredFields) {
        if (!(field in httpRequest.body)) {
          return await new Promise(resolve => { resolve(badRequest(new MissingParamError(field))) })
        }
      }

      return ok('success')
    } catch (error) {
      return serverError(error.stack)
    }
  }
}
