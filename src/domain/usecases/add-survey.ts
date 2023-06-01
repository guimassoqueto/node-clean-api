import { type SurveyAnswerModel } from '../../domain/models/survey'

export interface AddSurveyModel {
  question: string
  answers: SurveyAnswerModel[]
  createdAt: Date
}

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
