import { type SurveyResultModel } from '@src/domain/models/survey-result'

export interface LoadSurveyResult {
  load: (surveyId: string) => Promise<SurveyResultModel>
}
