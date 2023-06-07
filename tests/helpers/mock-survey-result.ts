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