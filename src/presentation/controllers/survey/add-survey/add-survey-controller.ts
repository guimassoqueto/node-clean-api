import { badRequest, noContent, serverError } from '@src/presentation/helpers/http/'
import { type Controller, type HttpRequest, type HttpResponse } from '@src/presentation/protocols'
import { type AddSurvey, type Validation } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { question, answers } = httpRequest.body
      await this.addSurvey.add({ question, answers, date: new Date() })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
