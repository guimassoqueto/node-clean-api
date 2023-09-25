import { LoadSurveysRepository } from "@src/data/protocols/db/survey"
import { mockSurveyModels } from "./mock-survey"
import { SurveyModel } from "@src/domain/models/survey"


export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  accountId: string
  surveyModels = mockSurveyModels()

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return this.surveyModels
  }
}