import { SaveSurveyResultController } from '@src/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { HttpRequest } from '@src/presentation/protocols'
import { forbidden, serverError, ok } from '@src/presentation/helpers/http'
import { 
  LoadSurveyById, SurveyModel, InvalidParamError,
  SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel
} from '@src/presentation/controllers/survey-result/save-survey-result/save-survey-result-protocols'


const RealDate = Date;
class MockDate extends RealDate {
  constructor() {
    super('2030-01-01T00:00:00Z');
  }
}

function makeSaveSurveyResult(): SaveSurveyResult {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }

  return new SaveSurveyResultStub()
}

function makeLoadSurveyById(): LoadSurveyById {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string) : Promise<SurveyModel | null> {
      return new Promise (resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

function makeSut(): SutTypes {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

function makeFakeRequest(): HttpRequest {
  return {
    params: {
      surveyId: 'any-id'
    },
    body: {
      answer: 'any-answer'
    },
    accountId: 'any-account-id'
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


function makeFakeSurveyResult(): SurveyResultModel {
  return {
    id: 'valid-id',
    surveyId: 'valid-survey-id',
    accountId: 'valid-survey-id',
    answer: 'valid-answer',
    date: new Date(2030, 11, 31)
  }
}



describe('SaveSurveyResultController' , () => {

  beforeAll(() => {
    (global as any).Date = MockDate;
  })

  afterAll(() => {
    (global as any).Date = RealDate;
  })

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

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    request.body = {
      answer: 'wrong-answer'
    }

    const response = await sut.handle(request)
    expect(response).toStrictEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct args', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const request = makeFakeRequest()
    await sut.handle(request)

    expect(saveSpy).toBeCalledWith({
      accountId: request.accountId,
      surveyId: request.params.surveyId,
      answer: request.body.answer,
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const error = new Error()
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(error)
    const request = makeFakeRequest()

    const response = await sut.handle(request)
    expect(response).toStrictEqual(serverError(error))
  })

  test('Should return 200 on success', async () => {
    const { sut} = makeSut()
    const request = makeFakeRequest()

    const response = await sut.handle(request)
    expect(response).toStrictEqual(ok(makeFakeSurveyResult()))
  })
})
