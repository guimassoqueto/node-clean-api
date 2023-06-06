import { loggerConfig } from '@src/logger-config'
import {
  type Controller, type HttpRequest, type HttpResponse,
  type LoadSurveyById, serverError,
  notFound, ok
} from './save-survey-result-protocols'

const logger = loggerConfig('SaveSurveyResultController')

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return notFound()

      return ok(survey)
    } catch (error) {
      logger.info(error)
      return serverError(error)
    }
  }
}
