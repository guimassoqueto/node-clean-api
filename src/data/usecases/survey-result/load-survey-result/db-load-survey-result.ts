import { type SurveyModel } from '../../survey/load-survey-by-id/db-load-survey-by-id-protocols'
import {
  type LoadSurveyResult,
  type LoadSurveyResultRepository,
  type LoadSurveyByIdRepository,
  type SurveyResultModel
} from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId) as SurveyModel
      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => Object.assign({}, answer, { count: 0, percent: 0 }))
      }
    }
    return surveyResult
  }
}
