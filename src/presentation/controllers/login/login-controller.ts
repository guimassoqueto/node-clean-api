import {
  type EmailValidator,
  type PasswordValidator,
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type Authentication
} from './login-protocols'
import { serverError, badRequest, ok, unauthorized } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly passwordValidator: PasswordValidator,
    private readonly authentication: Authentication
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

      const { email, password } = httpRequest.body

      // valida o email do usuário
      const isValidEmail = await this.emailValidator.isValid(email)
      if (!isValidEmail) return badRequest(new InvalidParamError('email'))

      // valida a senha do usuário
      const isValidPassword = await this.passwordValidator.isStrong(password)
      if (!isValidPassword) return badRequest(new InvalidParamError('password'))

      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) return unauthorized()

      return ok('success')
    } catch (error) {
      return serverError(error.stack)
    }
  }
}
