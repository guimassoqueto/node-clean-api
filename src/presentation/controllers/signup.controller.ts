import { MissingParamError } from '../errors/missing-param-error'
import { type IHttpRequest, type IHttpResponse } from '../protocols/http'

export class SignUpControlller {
  public handle (httpRequest: IHttpRequest): IHttpResponse {
    // checks for name
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }
    // checks for email
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }

    // checks for password
    if (!httpRequest.body.password) {
      return {
        statusCode: 400,
        body: new MissingParamError('password')
      }
    }

    return {
      statusCode: 200,
      body: 'Success'
    }
  }
}
