import { ok, forbidden, serverError } from '@src/presentation/helpers/http/http-helper'
import { type HttpResponse, type Middleware } from '@src/presentation/protocols'
import { type LoadAccountByToken, AccessDeniedError } from './auth-middleware-protocols'

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request

      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
        return forbidden(new AccessDeniedError())
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
