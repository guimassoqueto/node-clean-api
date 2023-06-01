import {
  type SurveyModel,
  type LoadSurveys,
  type LoadSurveysRepository
} from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.load()
    return await new Promise(resolve => { resolve([]) })
  }
}
