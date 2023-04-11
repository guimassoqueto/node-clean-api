import {
  type Controller,
  type PasswordValidator,
  type AddAccount,
  type HttpRequest,
  type HttpResponse,
  type Validation
} from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { InvalidParamError } from '../../errors'

export class SignUpControlller implements Controller {
  constructor (
    private readonly passwordValidator: PasswordValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { name, email, password } = httpRequest.body

      // valida que o nome existe e não é vazio e é composto por no mínimo 3 letras
      if ((name as string).length < 3) return badRequest(new InvalidParamError('name'))

      // valida a senha do usuário
      const isValidPassword = await this.passwordValidator.isStrong(password)
      if (!isValidPassword) return badRequest(new InvalidParamError('password'))

      const account = await this.addAccount.add({ name, email, password })

      return ok(account)
    } catch (error) {
      return serverError(error.stack)
    }
  }
}
