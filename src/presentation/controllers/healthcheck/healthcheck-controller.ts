import loggerConfig from '../../../logger-config'
import { serverError } from '../../helpers/http/http-helper'
import { type Controller, type HttpRequest, type HttpResponse } from '../../protocols'

const logger = loggerConfig('healthcheck-controller')

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
      logger.error(error)
      return serverError(error)
    }
  }
}
