import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { type IHttpRequest, type IHttpResponse } from '../protocols/http'

export class SignUpControlller {
  public handle (httpRequest: IHttpRequest): IHttpResponse {
    // checks for name
    if (!httpRequest.body.name) return badRequest(new MissingParamError('name'))

    // checks for email
    if (!httpRequest.body.email) return badRequest(new MissingParamError('email'))

    // checks for password
    if (!httpRequest.body.password) return badRequest(new MissingParamError('password'))

    return {
      statusCode: 200,
      body: 'Success'
    }
  }
}
