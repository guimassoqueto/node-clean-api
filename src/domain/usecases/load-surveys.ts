import { type SurveyModel } from '@src/domain/models/survey'

export interface LoadSurveys {
  load: () => Promise<SurveyModel[]>
}
