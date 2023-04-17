import { serverError } from "../../helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class HealthCheckController implements Controller{
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          status: "i'm live"
        }
      }
      return new Promise(resolve => resolve(httpResponse))
    }
    catch (error) {
      return serverError(error)
    }
  }
}