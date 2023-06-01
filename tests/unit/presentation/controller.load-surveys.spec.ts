import { LoadSurveysController } from '../../../src/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { SurveyModel, LoadSurveys } from '../../../src/presentation/controllers/survey/load-surveys/load-surveys-protocols'
import { noContent, ok, serverError } from '../../../src/presentation/helpers/http/http-helper'

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


function makeLoadSurveys(): LoadSurveys {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysStub()
}


type SutType = {
  sut: LoadSurveysController,
  loadSurveysStub: LoadSurveys
}

function makeSut(): SutType {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveysController' , () => {
  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, "load")
    await sut.handle({})
    
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    
    expect(response).toEqual(ok(makeFakeSurveys()))
  })

  test('Should throw if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const error = new Error()
    jest.spyOn(loadSurveysStub, "load").mockRejectedValueOnce(error)
    const response = await sut.handle({})

    expect(response).toEqual(serverError(error))
  })

  test('Should return 204 if LoadSurveys return an empty list', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, "load").mockResolvedValue([])
    const response = await sut.handle({})

    expect(response).toEqual(noContent())
  })

})