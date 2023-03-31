import {
  type Controller,
  type EmailValidator,
  type PasswordValidator,
  type AddAccount,
  type HttpRequest,
  type HttpResponse
} from './signup-protocols'
import { badRequest, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'

export default class SignUpControlller implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly passwordValidator: PasswordValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, passwordValidator: PasswordValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.passwordValidator = passwordValidator
    this.addAccount = addAccount
  }

  public handle (httpRequest: HttpRequest): HttpResponse {
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

      const account = this.addAccount.add({ name, email, password })

      return {
        statusCode: 200,
        body: account
      }
    } catch (error) {
      return serverError()
    }
  }
}
