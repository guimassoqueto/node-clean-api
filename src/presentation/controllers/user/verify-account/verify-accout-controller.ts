import {
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type Validation
} from './verify-account-protocols'
import loggerConfig from '../../../../logger-config'
import { serverError, badRequest, ok, conflict } from '../../../helpers/http/http-helper'
import { type AccountVerification } from '@src/domain/usecases/account-verification'
import { AccountAlreadyVerifiedError } from '../../../../errors'

const logger = loggerConfig('verify-account-controller')

export class VerifyAccountController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly accountVerification: AccountVerification
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.query)
      if (error) return badRequest(error)

      const { accountToken } = httpRequest.query
      const accessToken = await this.accountVerification.verify(accountToken)
      if (!accessToken) return conflict(new AccountAlreadyVerifiedError())

      return ok({ status: 'account verified', accessToken })
    } catch (error) {
      logger.error(error)
      return serverError(error)
    }
  }
}
