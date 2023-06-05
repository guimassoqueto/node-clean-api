import { DbSaveSurveyResult } from '@src/data/usecases/save-survey-result/db-save-survey-result'
import { 
  SaveSurveyResultModel,
  SurveyResultModel,
  SaveSurveyResultRepository
 } from '@src/data/usecases/save-survey-result/db-save-survey-result-protocols'


const RealDate = Date;
class MockDate extends RealDate {
  constructor() {
    super('2030-01-01T00:00:00Z');
  }
}

function makeFakeSurveyResultData(): SaveSurveyResultModel {
  return {
    surveyId: "any-survey-id",
    accountId: "any-account-id",
    answer: "any-answer",
    date: new Date(2030, 11, 31)
  }
}

function makeFakeSurveyResult(): SurveyResultModel {
  return Object.assign({}, makeFakeSurveyResultData(), {id: "any-id"})
}

function makeSurveyResultRepository(): SaveSurveyResultRepository {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
} 

type SutTypes = {
  sut: DbSaveSurveyResult,
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

function makeSut(): SutTypes {
  const saveSurveyResultRepositoryStub = makeSurveyResultRepository()
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
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, "save")
    const surveyResultData = makeFakeSurveyResultData()
    await sut.save(surveyResultData)

    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, "save").mockRejectedValueOnce(new Error())
    const surveyResultData = makeFakeSurveyResultData()
    const promise =  sut.save(surveyResultData)

    await expect(promise).rejects.toThrow()
  })

  test('Should return a survey result on SaveSurveyResultRepository success', async () => {
    const { sut } = makeSut()
    const surveyResultData = makeFakeSurveyResultData()
    const surveyResult =  await sut.save(surveyResultData)

    expect(surveyResult).toEqual(makeFakeSurveyResult())
  })

})
