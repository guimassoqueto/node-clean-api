import { type SurveyResultModel } from '@src/domain/models/survey-result'
import { type SaveSurveyResultParams } from '@src/domain/usecases/survey-result/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
