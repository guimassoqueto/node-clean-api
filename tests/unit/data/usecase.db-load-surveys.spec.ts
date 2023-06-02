import { DbLoadSurveys } from '@src/data/usecases/load-surveys/db-load-surveys'
import { LoadSurveysRepository } from '@src/data/protocols/db/survey'
import { SurveyModel } from '@src/domain/models/survey'

function makeFakeSurveys(): SurveyModel[] {
  return [
    {
      id: 'id1',
      question: 'q1',
      answers: [{ answer: 'a1' }, { answer: 'a2'}],
      createdAt: new Date(2030, 11, 31)
    },
    {
      id: 'id2',
      question: 'q2',
      answers: [{ answer: 'a1' }, { answer: 'a2'}, { answer: 'a3'}],
      createdAt: new Date(2030, 11, 30)
    }
  ]
}

function makeLoadSurveyRepo(): LoadSurveysRepository {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysRepositoryStub()
}

type SutTypes = {
  sut: DbLoadSurveys,
  loadSurveysRepositoryStub: LoadSurveysRepository
}

function makeSut(): SutTypes {
  const loadSurveysRepositoryStub = makeLoadSurveyRepo()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys' , () => {
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const spyLoad = jest.spyOn(loadSurveysRepositoryStub, "loadAll")
    await sut.load()

    expect(spyLoad).toHaveBeenCalled()
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, "loadAll").mockRejectedValueOnce(new Error())

    const promise = sut.load()

    await expect(promise).rejects.toThrow()
  })

  test('Should return a list of Surveys on LoadSurveysRepository success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()

    expect(surveys).toEqual(makeFakeSurveys())
  })
})
