import { type SurveyModel } from '@src/domain/models/survey'

export interface LoadSurveysRepository {
  loadAll: () => Promise<SurveyModel[]>
}
