import { type SurveyModel } from '@src/domain/models/survey'

export interface LoadSurveys {
  load: (accountId: string) => Promise<SurveyModel[]>
}
