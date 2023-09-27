import { DbSaveSurveyResult } from '@src/data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { 
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
 } from '@src/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { 
  RealDate, 
  MockDate, 
  mockSaveSurveyResultParams, 
  mockSurveyResultModel,
  mockSaveSurveyResultRepository,
  mockLoadSurveyResultRepository,
} from '@tests/helpers'




type SutTypes = {
  sut: DbSaveSurveyResult,
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository,
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

function makeSut(): SutTypes {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
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

  test('Should throw if LoadurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const surveyResultData = mockSaveSurveyResultParams()
    const promise =  sut.save(surveyResultData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const surveyResultData = mockSaveSurveyResultParams()
    await sut.save(surveyResultData)

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyResultData.surveyId)
  })

  test('Should return a survey result on SaveSurveyResultRepository success', async () => {
    const { sut } = makeSut()
    const surveyResultData = mockSaveSurveyResultParams()
    const surveyResult =  await sut.save(surveyResultData)

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

})
