import { type LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../../errors'
import { serverError, forbidden } from '../helpers/http/http-helper'
import { type HttpRequest, type HttpResponse, type Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const xAccessToken = httpRequest.headers?.['x-access-token']

      if (xAccessToken) {
        await this.loadAccountByToken.load(xAccessToken)
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
