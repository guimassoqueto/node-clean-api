import { type SurveyModel } from '@src/domain/models/survey'

export interface LoadSurveyById {
  loadById: (id: string) => Promise<SurveyModel | null>
}
