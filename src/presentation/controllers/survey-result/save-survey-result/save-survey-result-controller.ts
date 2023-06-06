import { type HttpRequest, type HttpResponse, type Controller } from '@src/presentation/protocols'
import { forbidden, ok, serverError } from '@src/presentation/helpers/http'
import { type LoadSurveyById, loggerConfig, InvalidParamError } from './save-survey-result-protocols'

const logger = loggerConfig('SaveSurveyResultController')

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      return ok(survey)
    } catch (error) {
      logger.info(error)
      return serverError(error)
    }
  }
}
