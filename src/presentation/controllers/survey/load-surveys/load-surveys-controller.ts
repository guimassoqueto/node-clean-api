import { noContent, ok, serverError } from '@src/presentation/helpers/http/'
import { type Controller, type HttpResponse } from '@src/presentation/protocols'
import { type LoadSurveys } from './load-surveys-protocols'

export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId)
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
