import { type AddSurveyParams } from '@src/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyParams) => Promise<void>
}
