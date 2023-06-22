import { LoadSurveyResultController } from '@src/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { HttpRequest } from '@src/presentation/protocols'
import { 
  LoadSurveyResult, SurveyResultModel
} from '@src/presentation/controllers/survey-result/load-survey-result/load-survey-result-protocols'
import { mockSurveyResultModel } from '@tests/helpers'

function mockLoadSurveyByIdStub(): LoadSurveyResult {
  class LoadSurveyByIdStub implements LoadSurveyResult {
    load (surveyId: string): Promise<SurveyResultModel> {
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
})

