import { type SurveyAnswerModel } from '@src/domain/models/survey'

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswerModel[]
  createdAt: Date
}

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
