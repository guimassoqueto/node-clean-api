import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { badRequest } from '../helpers/http-helper'
import { type Controller } from '../protocols/controller'
import { type IHttpRequest, type IHttpResponse } from '../protocols/http'
import { type EmailValidator } from '../protocols/email-validator'
import { type PasswordValidator } from '../protocols/password-validator'
import { ServerError } from '../errors/server-error'

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

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValidEmail) return badRequest(new InvalidParamError('email'))

      const isValidPassword = this.passwordValidator.isStrong(httpRequest.body.password)
      if (!isValidPassword) return badRequest(new InvalidParamError('password'))

      return {
        statusCode: 200,
        body: 'Success'
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
