import {
  type LoadAccountByToken,
  ok,
  forbidden,
  AccessDeniedError,
  serverError
} from './auth-middleware-protocols'
import { type HttpRequest, type HttpResponse, type Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const xAccessToken = httpRequest.headers?.['x-access-token']

      if (xAccessToken) {
        const account = await this.loadAccountByToken.load(xAccessToken, this.role)

        if (account) {
          const accountId = account.id
          return ok({ accountId })
        }

        return forbidden(new AccessDeniedError())
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
