import { type EmailValidator, type Controller, type HttpRequest, type HttpResponse } from './login-protocols'
import { serverError, badRequest, ok } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields: string[] = ['email', 'password']

      // checa se os campos obrigatórios esperados estão presentes no corpo da requisição
      for (const field of requiredFields) {
        if (!(field in httpRequest.body)) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email } = httpRequest.body

      // valida o email do usuário
      const isValidEmail = await this.emailValidator.isValid(email)
      if (!isValidEmail) return badRequest(new InvalidParamError('email'))

      return ok('success')
    } catch (error) {
      return serverError(error.stack)
    }
  }
}
