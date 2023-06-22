import { DbLoadSurveyResult } from "@src/data/usecases/survey-result/load-survey-result/db-load-survey-result"
import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from "@src/data/usecases/survey-result/load-survey-result/db-load-survey-result-protocols"
import { 
  MockDate,
  RealDate,
  mockLoadSurveyResultRepository, 
  mockSurveyResultModel, 
  mockLoadSurveyByIdRepository } from '@tests/helpers'


type SutTypes = {
  sut: DbLoadSurveyResult,
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository,
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

function makeSut(): SutTypes {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyResult' , () => {
  beforeAll(async () => {
    (global as any).Date = MockDate;
  });

  afterAll(async () => {
    (global as any).Date = RealDate;
  });

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

  test('Should call LoadSurveyByIdRepository if LoadSurveyRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.load('any-survey-id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any-survey-id')
  }) 

  test('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResultModel = await sut.load('any-survey-id')

    expect(surveyResultModel).toStrictEqual(mockSurveyResultModel())
  }) 
})
