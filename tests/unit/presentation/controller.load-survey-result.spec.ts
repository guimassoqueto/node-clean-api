import { LoadSurveyResultController } from '@src/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { HttpRequest } from '@src/presentation/protocols'
import { forbidden, serverError } from '@src/presentation/helpers/http'
import { 
  LoadSurveyResult, SurveyResultModel, InvalidParamError
} from '@src/presentation/controllers/survey-result/load-survey-result/load-survey-result-protocols'
import { mockSurveyResultModel } from '@tests/helpers'


function mockLoadSurveyByIdStub(): LoadSurveyResult {
  class LoadSurveyByIdStub implements LoadSurveyResult {
    load (surveyId: string): Promise<SurveyResultModel | null> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: LoadSurveyResultController,
  loadSurveyByIdStub: LoadSurveyResult
}

function makeSut(): SutTypes {
  const loadSurveyByIdStub = mockLoadSurveyByIdStub()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

function mockRequest(): HttpRequest {
  return {
    params: {
      surveyId: 'any-survey-id'
    }
  }
}


describe('LoadSurveyResultController' , () => {
  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'load')
    const request = mockRequest()
    await sut.handle(request)

    expect(loadSpy).toHaveBeenCalledWith(request.params?.surveyId)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockResolvedValueOnce(null)
    const request = mockRequest()
    const response = await sut.handle(request)

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const error = new Error()
    jest.spyOn(loadSurveyByIdStub, 'load').mockRejectedValueOnce(error)
    const request = mockRequest()
    const response = await sut.handle(request)

    expect(response).toEqual(serverError(error))
  })
})

