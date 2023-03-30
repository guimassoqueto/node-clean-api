import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { type Controller } from '../protocols/controller'
import { type IHttpRequest, type IHttpResponse } from '../protocols/http'
import { type EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'

export class SignUpControlller implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  public handle (httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields: string[] = ['name', 'email', 'password', 'passwordConfirmation']

    // checa se os campos obrigatórios esperados estão presentes no corpo da requisição

    for (const field of requiredFields) {
      if (!(field in httpRequest.body)) return badRequest(new MissingParamError(field))
    }

    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)

    if (!isValidEmail) return badRequest(new InvalidParamError('email'))

    return {
      statusCode: 200,
      body: 'Success'
    }
  }
}
