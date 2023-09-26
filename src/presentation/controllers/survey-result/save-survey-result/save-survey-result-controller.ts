import { type HttpResponse, type Controller } from '@src/presentation/protocols'
import { forbidden, ok, serverError } from '@src/presentation/helpers/http'
import {
  type LoadSurveyById, loggerConfig, InvalidParamError,
  type SaveSurveyResult
} from './save-survey-result-protocols'

const logger = loggerConfig('SaveSurveyResultController')

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  }
}

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request

      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }

      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date()
      })

      return ok(surveyResult)
    } catch (error) {
      logger.info(error)
      return serverError(error)
    }
  }
}
