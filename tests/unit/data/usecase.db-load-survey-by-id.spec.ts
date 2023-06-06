import { DbLoadSurveyById } from '@src/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { LoadSurveyByIdRepository, SurveyModel } from '@src/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'

const RealDate = Date;
class MockDate extends RealDate {
  constructor() {
    super('2030-01-01T00:00:00Z');
  }
}

function makeFakeSurvey(): SurveyModel {
  return {
    id: 'id1',
    question: 'q1',
    answers: [{ answer: 'a1' }, { answer: 'a2'}],
    createdAt: new Date(2030, 11, 31)
  }
}

function makeLoadSurveyByIdRepository(): LoadSurveyByIdRepository {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository{
    async loadById (id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
  sut: DbLoadSurveyById,
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

function makeSut(): SutTypes {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}


describe('DbLoadSurveyById' , () => {
  beforeAll(() => {
    (global as any).Date = MockDate;
  })
  afterAll(() => {
    (global as any).Date = RealDate;
  })

  test('Should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const spyLoad = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('any-id')

    expect(spyLoad).toHaveBeenCalledWith('any-id')
  })

  test('Should DbLoadSurveyById throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.loadById('any-id')

    await expect(promise).rejects.toThrow()
  })

  test('Should return a valid survey LoadSurveyByIdRepository succeded', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    const survey = await sut.loadById('any-id')

    expect(survey).toStrictEqual(makeFakeSurvey())
  })

  test('Should return null LoadSurveyByIdRepository dont find a survey related with the provided id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockResolvedValueOnce(null)
    const result = await sut.loadById('any-id')

    expect(result).toBeNull()
  })
})