import { AddSurveyRepository, AddSurveyParams } from '@src/data/usecases/survey/add-survey/db-add-survey-protocols'
import { DbAddSurvey } from '@src/data/usecases/survey/add-survey/db-add-survey'
import { mockAddSurveysParams, mockAddSurveyRepository } from '@tests/helpers'


type SutTypes = {
  sut: DbAddSurvey,
  addSurveyRepositoryStub: AddSurveyRepository
}

function makeSut(): SutTypes {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    sut, 
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey' , () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const newSurveyData = mockAddSurveysParams()
    await sut.add(newSurveyData)

    expect(addSpy).toBeCalledWith(newSurveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const newSurveyData = mockAddSurveysParams()
    const promise = sut.add(newSurveyData)

    await expect(promise).rejects.toThrow()
  })
})
