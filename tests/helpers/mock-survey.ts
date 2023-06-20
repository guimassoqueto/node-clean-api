import { SurveyModel } from "@src/domain/models/survey";
import { AddSurveyParams } from '@src/domain/usecases/survey/add-survey'


/**
 * Create a Survey
 */
export function mockSurveyModel(): SurveyModel {
  return {
    id: 'any-id',
    question: 'any-question',
    answers: [
      {
        image:'any-image',
        answer: 'any-answer-1'
      },
      {
        answer: 'any-answer-2'
      },
    ],
    date: new Date(2030, 11, 31)
  }
}


/**
 * Create a list of Surveys
 */
export function mockSurveyModels(ListSize: number = 2): SurveyModel[] {
  let surveys: SurveyModel[] = [];
  for (let i = 0; i <= ListSize; i++) {
    surveys.push({
      id: 'any-id',
      question: `any-question${i}`,
      answers: [
        {
          image:'any-image',
          answer: 'any-answer-1'
        },
        {
          answer: 'any-answer-2'
        },
      ],
      date: new Date(2030, 11, 31)
    });
  }
  return surveys
}


/**
 * Mock AddSurveyParams
 */
export function mockAddSurveysParams(questionNumber?: number): AddSurveyParams {
  return {
    date: new Date(2030,11, 31),
    question: `any-question${(typeof questionNumber !== 'undefined') ? questionNumber: ''}`,
    answers: [
      {
        image:'any-image',
        answer: 'any-answer-1'
      },
      {
        answer: 'any-answer-2'
      },
    ]
  }
}