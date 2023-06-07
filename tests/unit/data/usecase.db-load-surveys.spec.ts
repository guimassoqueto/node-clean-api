import { DbLoadSurveys } from '@src/data/usecases/survey/load-surveys/db-load-surveys'
import { LoadSurveysRepository } from '@src/data/protocols/db/survey'
import { mockSurveyModels } from '@tests/helpers'
import { SurveyModel } from '@src/domain/models/survey'


function mockLoadSurveyRepository(): LoadSurveysRepository {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModels())
    }
  }
  return new LoadSurveysRepositoryStub()
}


type SutTypes = {
  sut: DbLoadSurveys,
  loadSurveysRepositoryStub: LoadSurveysRepository
}

function makeSut(): SutTypes {
  const loadSurveysRepositoryStub = mockLoadSurveyRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys' , () => {
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const spyLoad = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()

    expect(spyLoad).toHaveBeenCalled()
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())

    const promise = sut.load()

    await expect(promise).rejects.toThrow()
  })

  test('Should return a list of Surveys on LoadSurveysRepository success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()

    expect(surveys).toEqual(mockSurveyModels())
  })
})
