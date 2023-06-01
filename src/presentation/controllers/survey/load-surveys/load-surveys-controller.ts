import { ok } from '../../../helpers/http/http-helper'
import {
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type LoadSurveys
} from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load()
    return await new Promise(resolve => { resolve(ok('')) })
  }
}
