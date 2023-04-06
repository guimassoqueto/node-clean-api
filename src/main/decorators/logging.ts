import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'

// decorator que modifica as classes que implementam a interface Controller
export class LoggingControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await this.controller.handle(httpRequest)
  }
}
