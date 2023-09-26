import { LoadSurveysController } from '@src/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { noContent, ok, serverError } from '@src/presentation/helpers/http/http-helper'
import { LoadSurveysSpy } from '@tests/presentation/mocks'
import { faker } from "@faker-js/faker";


function mockRequest(): LoadSurveysController.Request {
  return {
    accountId: faker.string.uuid()
  }
}

type SutTypes = {
  sut: LoadSurveysController,
  loadSurveysSpy: LoadSurveysSpy
}

function makeSut(): SutTypes {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)
  return {
    sut,
    loadSurveysSpy
  }
}

describe('LoadSurveysController', () => {
  test('Should call LoadSurveysSpy with corret value', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveysSpy.accountId).toEqual(request.accountId)
  })

  test('Should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(ok(loadSurveysSpy.surveyModels))
  })

  test('Should throw if LoadSurveysSpy throws', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const error = new Error()
    jest.spyOn(loadSurveysSpy, 'load').mockRejectedValueOnce(error)
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(error))
  })

  test('Should return 204 if LoadSurveysSpy return an empty list', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.surveyModels = []
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(noContent())
  })
})