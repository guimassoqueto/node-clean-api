import { serverError } from '../../helpers/http/http-helper'
import { type Controller, type HttpRequest, type HttpResponse } from '../../protocols'

export class HealthCheckController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          status: "i'm live"
        }
      }
      return await new Promise(resolve => { resolve(httpResponse) })
    } catch (error) {
      return serverError(error)
    }
  }
}
