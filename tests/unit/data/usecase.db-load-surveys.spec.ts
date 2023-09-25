import { DbLoadSurveys } from '@src/data/usecases/survey/load-surveys/db-load-surveys'
import { LoadSurveysRepository } from '@src/data/protocols/db/survey'
import { mockSurveyModels, LoadSurveysRepositorySpy } from '@tests/helpers'
import { faker } from '@faker-js/faker'


type SutTypes = {
  sut: DbLoadSurveys,
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}

function makeSut(): SutTypes {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)
  return {
    sut,
    loadSurveysRepositorySpy
  }
}

describe('DbLoadSurveys' , () => {
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const accountId = faker.string.uuid()
    await sut.load(accountId)
    expect(loadSurveysRepositorySpy.accountId).toBe(accountId)
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockRejectedValueOnce(new Error())
    const promise = sut.load(faker.string.uuid())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a list of Surveys on LoadSurveysRepository success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const surveys = await sut.load(faker.string.uuid())
    expect(surveys).toEqual(loadSurveysRepositorySpy.surveyModels)
  })
})
