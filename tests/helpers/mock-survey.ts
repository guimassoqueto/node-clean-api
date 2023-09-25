import { LoadSurveyByIdRepository } from "@src/data/protocols/db/survey";
import { SurveyModel } from "@src/domain/models/survey";
import { AddSurveyParams } from '@src/domain/usecases/survey/add-survey'
import { LoadSurveys } from "@src/domain/usecases/survey/load-surveys";


export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveyModels(3)
  accountId: string

 async load (accountId: string): Promise<SurveyModel[]> {
  this.accountId = accountId
  return this.surveyModels
 }
}


/**
 * Create a Survey
 */
export function mockSurveyModel(): SurveyModel {
  return {
    id: 'any-survey-id',
    question: 'any-question',
    answers: [
      {
        image:'any-image-1',
        answer: 'any-answer-1'
      },
      {
        image:'any-image-2',
        answer: 'any-answer-2'
      },
      {
        image:'any-image-3',
        answer: 'any-answer-3'
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
export function mockAddSurveysParams(): AddSurveyParams {
  return {
    date: new Date(2030,11, 31),
    question: 'any-question',
    answers: [
      {
        image:'any-image',
        answer: 'any-answer-1'
      },
      {
        answer: 'any-answer-2'
      },
      {
        answer: 'any-answer-3'
      },
    ]
  }
}

export function mockLoadSurveyByIdRepository(): LoadSurveyByIdRepository {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository{
    async loadById (surveyId: string): Promise<SurveyModel | null> {
      return Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}