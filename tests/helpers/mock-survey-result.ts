import { LoadSurveyResultRepository, SaveSurveyResultRepository } from "@src/data/protocols/db/survey";
import { SurveyResultModel } from "@src/domain/models/survey-result";
import { SaveSurveyResultParams } from "@src/domain/usecases/survey-result/save-survey-result";


/**
 * Mock SaveSurveyResultParams
 */
export function mockSaveSurveyResultParams(): SaveSurveyResultParams {
  return {
    surveyId: 'any-survey-id',
    accountId: 'any-account-id',
    answer: 'any-answer',
    date: new Date(2030, 11, 31)
  }
}

export function mockSurveyResultModel(): SurveyResultModel {
  return {
    surveyId: 'any-survey-id',
    question: 'any-question',
    answers: [
      {
        image: 'any-image-1',
        answer: 'any-answer-1',
        count: 0,
        percent: 0
      },
      {
        image: 'any-image-2',
        answer: 'any-answer-2',
        count: 0,
        percent: 0
      }
    ],
    date: new Date()
  }
}

export function mockSaveSurveyResultRepository(): SaveSurveyResultRepository {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new SaveSurveyResultRepositoryStub()
} 

export function mockLoadSurveyResultRepository(): LoadSurveyResultRepository {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultRepositoryStub()
} 