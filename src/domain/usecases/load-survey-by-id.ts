import { type SurveyModel } from '@src/domain/models/survey'

export interface LoadSurveyById {
  load: (id: string) => Promise<SurveyModel>
}
