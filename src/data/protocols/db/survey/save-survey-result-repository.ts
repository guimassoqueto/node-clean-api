import { type SurveyResultModel } from '@src/domain/models/survey-result'
import { type SaveSurveyResultModel } from '@src/domain/usecases/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
