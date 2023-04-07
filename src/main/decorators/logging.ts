import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'
import { type LoggingErrorRepository } from '../../data/protocols/logging-error-repository'

// decorator que modifica as classes que implementam a interface Controller
export class LoggingControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly loggingErrorRepository: LoggingErrorRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) await this.loggingErrorRepository.logError(httpResponse.body.stack)

    return httpResponse
  }
}
