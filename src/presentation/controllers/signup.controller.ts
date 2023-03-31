import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import {
  type IHttpRequest,
  type IHttpResponse,
  type Controller,
  type EmailValidator,
  type PasswordValidator
} from '../protocols'

export class SignUpControlller implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly passwordValidator: PasswordValidator

  constructor (emailValidator: EmailValidator, passwordValidator: PasswordValidator) {
    this.emailValidator = emailValidator
    this.passwordValidator = passwordValidator
  }

  public handle (httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields: string[] = ['name', 'email', 'password', 'passwordConfirmation']

      // checa se os campos obrigatórios esperados estão presentes no corpo da requisição
      for (const field of requiredFields) {
        if (!(field in httpRequest.body)) return badRequest(new MissingParamError(field))
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      // valida que o nome existe e não é vazio e é composto por no mínimo 3 letras
      if ((name as string).length < 3) return badRequest(new InvalidParamError('name'))

      // valida que a senha e a senha de confirmação são iguais
      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))

      // valida o email do usuário
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) return badRequest(new InvalidParamError('email'))

      // valida a senha do usuário
      const isValidPassword = this.passwordValidator.isStrong(password)
      if (!isValidPassword) return badRequest(new InvalidParamError('password'))

      return {
        statusCode: 200,
        body: 'Success'
      }
    } catch (error) {
      return serverError()
    }
  }
}
