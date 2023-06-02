import { type AddSurveyModel } from '@src/domain/usecases/add-survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
