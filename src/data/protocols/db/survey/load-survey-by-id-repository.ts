import { type SurveyModel } from '@src/domain/models/survey'

export interface LoadSurveyByIdRepository {
  loadById: (surveyId: string) => Promise<SurveyModel | null>
}
