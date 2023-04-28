import {
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type Validation,
  AccountVerificationError
} from './verify-account-protocols'
import loggerConfig from '../../../logger-config'
import { serverError, badRequest, ok } from '../../helpers/http/http-helper'
import { type AccountVerification } from '../../../domain/usecases/account-verification'

const logger = loggerConfig('verify-account-controller')

export class VerifyAccountController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly accountVerification: AccountVerification
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.params)
      if (error) return badRequest(error)

      const { accToken } = httpRequest.params
      const isAccountVerified = await this.accountVerification.verify(accToken)
      if (!isAccountVerified) return badRequest(new AccountVerificationError())

      return ok('account verificated')
    } catch (error) {
      logger.error(error)
      return serverError(error)
    }
  }
}
