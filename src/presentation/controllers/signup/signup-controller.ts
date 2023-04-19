import {
  type Controller,
  type AddAccount,
  type HttpRequest,
  type HttpResponse,
  type Validation
} from './signup-controller-protocols'
import { badRequest, ok, serverError, emailAlreadyInUse } from '../../helpers/http/http-helper'
import { EmailAlreadyInUseError } from '../../errors'

export class SignUpControlller implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({ name, email, password })

      return ok(account)
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) return emailAlreadyInUse()

      return serverError(error.stack)
    }
  }
}
