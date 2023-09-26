import { LoadSurveyResultController } from '@src/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { forbidden, ok, serverError } from '@src/presentation/helpers/http'
import { InvalidParamError } from '@src/presentation/controllers/survey-result/load-survey-result/load-survey-result-protocols'
import { MockDate, RealDate, LoadSurveyResultSpy } from '@tests/presentation/mocks'
import { faker } from '@faker-js/faker'


type SutTypes = {
  sut: LoadSurveyResultController,
  loadSurveyByIdSpy: LoadSurveyResultSpy
}

function makeSut(): SutTypes {
  const loadSurveyByIdSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(loadSurveyByIdSpy)
  return {
    sut,
    loadSurveyByIdSpy
  }
}

function mockRequest(): LoadSurveyResultController.Request {
  return {
    surveyId: faker.string.uuid()
  }
}

describe('LoadSurveyResultController' , () => {
  beforeAll(() => {
    (global as any).Date = MockDate;
  });
  afterAll(() => {
    (global as any).Date = RealDate;
  });

  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveyByIdSpy.surveyId).toEqual(request.surveyId)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const request = mockRequest()
    loadSurveyByIdSpy.result = null
    const response = await sut.handle(request)
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const error = new Error()
    jest.spyOn(loadSurveyByIdSpy, "load").mockRejectedValue(error)
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(error))
  })

  test('Should return 200 on success', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(ok(loadSurveyByIdSpy.result))
  })
})

