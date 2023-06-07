import { serverError } from '@src/presentation/helpers/http/http-helper'
import { type Controller, type HttpRequest, type HttpResponse } from '@src/presentation/protocols'
import { loggerConfig } from './healthcheck-protocols'

const logger = loggerConfig('healthcheck-controller')

export class HealthCheckController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          status: 'i\'m live'
        }
      }
      return await Promise.resolve(httpResponse)
    } catch (error) {
      logger.error(error)
      return serverError(error)
    }
  }
}
