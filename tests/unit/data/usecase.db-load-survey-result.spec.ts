import { DbLoadSurveyResult } from "@src/data/usecases/survey-result/load-survey-result/db-load-survey-result"
import { LoadSurveyResultRepository } from "@src/data/usecases/survey-result/load-survey-result/db-load-survey-result-protocols"
import { mockLoadSurveyResultRepository } from '@tests/helpers'


type SutTypes = {
  sut: DbLoadSurveyResult,
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

function makeSut(): SutTypes {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResult' , () => {
  test('Should call LoadSurveyResultRepository with correct argument', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any-survey-id')

    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any-survey-id')
  })  

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const promise =  sut.load('any-survey-id')

    await expect(promise).rejects.toThrow()
  }) 
})
