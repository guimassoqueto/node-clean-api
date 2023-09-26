import { badRequest, ok, serverError, conflict } from '@src/presentation/helpers/http'
import { type Controller, type HttpResponse } from '@src/presentation/protocols'
import {
  type AddAccount,
  type Validation,
  loggerConfig,
  EmailAlreadyInUseError
} from './signup-controller-protocols'

const logger = loggerConfig('signup-controller')

export namespace SignUpControlller {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}

export class SignUpControlller implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addAccount: AddAccount
  ) { }

  public async handle (request: SignUpControlller.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      const { name, email, password } = request

      const account = await this.addAccount.add({ name, email, password })

      return ok({ message: 'Ok', account })
    } catch (error) {
      logger.error(error)
      if (error instanceof EmailAlreadyInUseError) return conflict(error)
      return serverError(error)
    }
  }
}
