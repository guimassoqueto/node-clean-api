import { badRequest, ok, serverError, conflict } from '@src/presentation/helpers/http'
import { type Controller, type HttpRequest, type HttpResponse } from '@src/presentation/protocols'
import {
  type AddAccount,
  type Validation,
  type EmailService,
  type AddUnverifiedAccount,
  loggerConfig,
  EmailAlreadyInUseError
} from './signup-controller-protocols'

const logger = loggerConfig('signup-controller')

export class SignUpControlller implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addAccount: AddAccount,
    private readonly addUnverifiedAccount: AddUnverifiedAccount,
    private readonly emailService: EmailService
  ) { }

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({ name, email, password })

      // encripta a id do usuário e prenche essa cript no banco
      const unverifiedAccount = await this.addUnverifiedAccount.add(account.id)

      await this.emailService.sendAccountVerificationEmail({ email, accountToken: unverifiedAccount.accountToken })

      return ok({ message: `An email was sent to ${email} to verify the account.`, account })
    } catch (error) {
      logger.error(error)
      if (error instanceof EmailAlreadyInUseError) return conflict(error)
      return serverError(error)
    }
  }
}
