import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'
import { type LoggingRepository } from '../../data/protocols/db/logging/logging-error-repository'

// decorator que modifica as classes que implementam a interface Controller
export class LoggingControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly loggingRepository: LoggingRepository
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) await this.loggingRepository.logError(httpResponse.body.stack)

    return httpResponse
  }
}
