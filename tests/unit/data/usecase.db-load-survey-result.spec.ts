import { LoadSurveyResultRepository } from "@src/data/protocols/db/survey"
import { DbLoadSurveyResult } from "@src/data/usecases/survey-result/load-survey-result/db-load-survey-result"
import { SurveyResultModel } from "@src/domain/models/survey-result"
import { mockSurveyResultModel } from '@tests/helpers'

describe('DbLoadSurveyResult' , () => {
  test('Should call LoadSurveyResultRepository with correct argument', async () => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
      async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
        return Promise.resolve(mockSurveyResultModel())
      }

    }
    const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any-survey-id')

    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any-survey-id')
  })  
})
