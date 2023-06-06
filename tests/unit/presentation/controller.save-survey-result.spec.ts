import { SaveSurveyResultController } from '@src/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { 
  HttpRequest, LoadSurveyById, SurveyModel, Validation, notFound
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

describe('SaveSurveyResult' , () => {
  test('Should call LoadSurveyById with correct args', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const request = makeFakeRequest()

    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith(request.params.surveyId)
  })
})
