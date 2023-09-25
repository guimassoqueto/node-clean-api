import { type SurveyModel } from '@src/domain/models/survey'

export interface LoadSurveysRepository {
  loadAll: (accountId: string) => Promise<SurveyModel[]>
}
