import { type SurveyResultModel } from '@src/domain/models/survey-result'

export interface SaveSurveyResult {
  load: (surveyId: string) => Promise<SurveyResultModel>
}
