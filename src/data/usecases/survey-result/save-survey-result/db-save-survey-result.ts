import {
  type SaveSurveyResultRepository,
  type SurveyResultModel,
  type SaveSurveyResult,
  type SaveSurveyResultModel
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyData = await this.saveSurveyResultRepository.save(data)
    return surveyData
  }
}
