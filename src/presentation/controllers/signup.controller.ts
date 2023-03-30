import { type IHttpRequest, type IHttpResponse } from '../protocols/http'

export class SignUpControlller {
  public handle (httpRequest: IHttpRequest): IHttpResponse {
    // checks for name
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }
    // checks for email
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }
  }
}
