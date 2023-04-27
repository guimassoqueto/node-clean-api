import {
  type Controller,
  type AddAccount,
  type HttpRequest,
  type HttpResponse,
  type Validation,
  type EmailService,
  type AddUnverifiedAccount
} from './signup-controller-protocols'
import { badRequest, ok, serverError, emailAlreadyInUse } from '../../helpers/http/http-helper'
import { EmailAlreadyInUseError } from '../../errors'

export class SignUpControlller implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addAccount: AddAccount,
    private readonly addUnverifiedAccount: AddUnverifiedAccount,
    private readonly emailService: EmailService
  ) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({ name, email, password })

      // encripta a id do usuário e prenche essa cript no banco
      const accountIdHash = await this.addUnverifiedAccount.add(account.id)

      await this.emailService.sendAccountVerificationEmail({ email, hash: accountIdHash.encryptedAccountId })

      return ok(account)
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) return emailAlreadyInUse()
      return serverError(error.stack)
    }
  }
}
