import { type LoadSurveyResult } from '@src/domain/usecases/survey-result/load-survey-result'
import { type SurveyResultModel } from '@src/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { type LoadSurveyResultRepository } from '@src/data/protocols/db/survey/load-survey-result-repository'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    return await Promise.resolve(surveyResult)
  }
}
