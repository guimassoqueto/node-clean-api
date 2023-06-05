import { type SurveyModel } from '@src/domain/models/survey'

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<SurveyModel | null>
}
