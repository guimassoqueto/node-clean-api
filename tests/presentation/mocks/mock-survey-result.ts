import { faker } from "@faker-js/faker";
import { SurveyResultModel } from "@src/domain/models/survey-result";
import { LoadSurveyResult } from "@src/domain/usecases/survey-result/load-survey-result";
import { SaveSurveyResult, SaveSurveyResultParams } from "@src/domain/usecases/survey-result/save-survey-result";


export function mockSurveyResultModel(): SurveyResultModel {
  return {
    surveyId: faker.string.uuid(),
    question: faker.word.words(),
    answers: [
      {
        image: faker.image.url(),
        answer: faker.word.words(),
        count: 5,
        percent: 50
      },
      {
        image: faker.image.url(),
        answer: faker.word.words(),
        count: 3,
        percent: 30
      },
      {
        image: faker.image.url(),
        answer: faker.word.words(),
        count: 2,
        percent: 20
      }
    ],
    date: new Date()
  }
}


export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string
  result: SurveyResultModel | null = mockSurveyResultModel()

  async load(surveyId: string): Promise<SurveyResultModel | null> {
    this.surveyId = surveyId
    return this.result
  }
}

export class SaveSurveyResultSpy implements SaveSurveyResult {
  data: SaveSurveyResultParams
  result: SurveyResultModel = mockSurveyResultModel()
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.data = data
    return this.result
  }
}