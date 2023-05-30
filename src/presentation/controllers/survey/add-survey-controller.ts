import { badRequest, ok } from '../../helpers/http/http-helper'
import {
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type Validation,
  type AddSurvey
} from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) return badRequest(error)

    const { question, answers } = httpRequest.body
    await this.addSurvey.add({ question, answers })

    return ok('')
  }
}
