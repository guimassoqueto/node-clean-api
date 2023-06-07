import { LoadSurveysController } from '@src/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { LoadSurveys, SurveyModel } from '@src/presentation/controllers/survey/load-surveys/load-surveys-protocols'
import { noContent, serverError } from '@src/presentation/helpers/http/http-helper'
import { mockSurveyModels } from '@tests/helpers'


function mockLoadSurveys(): LoadSurveys {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(mockSurveyModels()))
    }
  }
  return new LoadSurveysStub()
}

type SutTypes = {
  sut: LoadSurveysController,
  loadSurveysStub: LoadSurveys
}

function makeSut(): SutTypes {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveysController' , () => {
  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    
    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual(mockSurveyModels())
  })

  test('Should throw if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const error = new Error()
    jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(error)
    const response = await sut.handle({})

    expect(response).toEqual(serverError(error))
  })

  test('Should return 204 if LoadSurveys return an empty list', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockResolvedValue([])
    const response = await sut.handle({})

    expect(response).toEqual(noContent())
  })

})