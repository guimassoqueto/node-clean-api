import { faker } from "@faker-js/faker";
import { SurveyModel } from "@src/domain/models/survey";
import { LoadSurveyById } from "@src/domain/usecases/survey/load-survey-by-id";
import { LoadSurveys } from "@src/domain/usecases/survey/load-surveys"


export function mockSurveyModel(): SurveyModel {
  return {
    id: faker.string.uuid(),
    question: faker.word.words(),
    answers: [
      {
        image: faker.image.url(),
        answer: faker.word.words()
      },
      {
        answer: faker.word.words()
      },
    ],
    date: new Date()
  }
}



function mockSurveyModels(totalSurveys: number = 2): SurveyModel[] {
  let surveys: SurveyModel[] = [];
  for (let i = 0; i < totalSurveys; i++) {
    surveys.push({
      id: faker.string.uuid(),
      question: faker.word.words(),
      answers: [
        {
          image: faker.image.url(),
          answer: faker.word.words()
        },
        {
          answer: faker.word.words()
        },
      ],
      date: new Date()
    });
  }
  return surveys
}


export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveyModels(3)
  accountId: string

 async load (accountId: string): Promise<SurveyModel[]> {
  this.accountId = accountId
  return this.surveyModels
 }
}


export class LoadSurveyByIdSpy implements LoadSurveyById {
  id: string
  result: SurveyModel | null = mockSurveyModel()
  async loadById(id: string): Promise<SurveyModel | null> {
    this.id = id
    return this.result
  }
}