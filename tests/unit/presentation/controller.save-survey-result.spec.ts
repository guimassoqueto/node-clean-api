import { SaveSurveyResultController } from '@src/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { HttpRequest } from '@src/presentation/protocols'
import { forbidden, serverError } from '@src/presentation/helpers/http'
import { 
  LoadSurveyById, SurveyModel, InvalidParamError
} from '@src/presentation/controllers/survey-result/save-survey-result/save-survey-result-protocols'


const RealDate = Date;
class MockDate extends RealDate {
  constructor() {
    super('2030-01-01T00:00:00Z');
  }
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

function makeSut(): SutTypes {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

function makeFakeRequest(): HttpRequest {
  return {
    params: {
      surveyId: 'any-survey-id'
    }
  }
}

function makeFakeSurvey(id: string = 'any-id'): SurveyModel {
  return {
    id,
    question: 'any-question',
    answers: [
      {
        image: 'https://any-image.com',
        answer: 'any-answer'
      }
    ],
    createdAt: new Date(2030, 11, 31)
  }
}

function makeLoadSurveyById(): LoadSurveyById {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string) : Promise<SurveyModel | null> {
      return new Promise (resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}

describe('SaveSurveyResultController' , () => {
  test('Should call LoadSurveyById with correct args', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const request = makeFakeRequest()

    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith(request.params.surveyId)
  })

  test('Should return 401 if surveyId does not exist', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const request = makeFakeRequest()

    const response = await sut.handle(request)
    expect(response).toStrictEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if surveyId throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const error = new Error()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(error)
    const request = makeFakeRequest()

    const response = await sut.handle(request)
    expect(response).toStrictEqual(serverError(error))
  })
})
