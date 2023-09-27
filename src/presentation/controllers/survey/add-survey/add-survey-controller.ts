import { badRequest, noContent, serverError } from '@src/presentation/helpers/http/'
import { type Controller, type HttpResponse } from '@src/presentation/protocols'
import { type AddSurvey, type Validation } from './add-survey-protocols'

export namespace AddSurveyController {
  export type Request = {
    question: string
    answers: Answer[]
  }

  export type Answer = {
    image?: string
    answer: string
  }
}

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      const { question, answers } = request
      await this.addSurvey.add({ question, answers, date: new Date() })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
