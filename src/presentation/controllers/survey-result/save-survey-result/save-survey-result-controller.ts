import { type HttpRequest, type HttpResponse, type Controller } from '@src/presentation/protocols'
import { forbidden, serverError } from '@src/presentation/helpers/http'
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
      if (survey) {
        const answers = survey.answers.map(a => a.answer)

        if (!answers.includes(httpRequest.body.answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      }

      return forbidden(new InvalidParamError('surveyId'))
    } catch (error) {
      logger.info(error)
      return serverError(error)
    }
  }
}
