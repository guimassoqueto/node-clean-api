import { ok, serverError } from '@src/presentation/helpers/http'
import { type Controller, type HttpRequest, type HttpResponse } from '@src/presentation/protocols'
import { type LoadSurveyResult, loggerConfig } from './load-survey-result-protocols'

const logger = loggerConfig('LoadSurveyResultController')

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      await this.loadSurveyById.load(surveyId)
      return await Promise.resolve(ok('ok'))
    } catch (error) {
      logger.error(error)
      return serverError(error)
    }
  }
}
