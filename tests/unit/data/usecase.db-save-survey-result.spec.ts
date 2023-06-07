import { DbSaveSurveyResult } from '@src/data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { 
  SaveSurveyResultParams,
  SurveyResultModel,
  SaveSurveyResultRepository
 } from '@src/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { RealDate, MockDate, mockSaveSurveyResultParams } from '@tests/helpers'


function mockSurveyResult(): SurveyResultModel {
  return Object.assign({}, mockSaveSurveyResultParams(), {id: 'any-id'})
}

function mockSurveyResultRepository(): SaveSurveyResultRepository {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(mockSurveyResult()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
} 

type SutTypes = {
  sut: DbSaveSurveyResult,
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

function makeSut(): SutTypes {
  const saveSurveyResultRepositoryStub = mockSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult' , () => {
  beforeAll(() => {
    (global as any).Date = MockDate;
  })
  afterAll(() => {
    (global as any).Date = RealDate;
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyResultData = mockSaveSurveyResultParams()
    await sut.save(surveyResultData)

    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const surveyResultData = mockSaveSurveyResultParams()
    const promise =  sut.save(surveyResultData)

    await expect(promise).rejects.toThrow()
  })

  test('Should return a survey result on SaveSurveyResultRepository success', async () => {
    const { sut } = makeSut()
    const surveyResultData = mockSaveSurveyResultParams()
    const surveyResult =  await sut.save(surveyResultData)

    expect(surveyResult).toEqual(mockSurveyResult())
  })

})
