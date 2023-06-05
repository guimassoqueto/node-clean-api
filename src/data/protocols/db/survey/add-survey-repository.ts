import { type AddSurveyModel } from '@src/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
