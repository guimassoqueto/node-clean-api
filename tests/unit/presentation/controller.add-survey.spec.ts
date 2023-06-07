import { AddSurveyController } from '@src/presentation/controllers/survey/add-survey/add-survey-controller'
import { noContent, serverError } from '@src/presentation/helpers/http/http-helper'
import { HttpRequest } from '@src/presentation/protocols'
import { AddSurvey, Validation, AddSurveyParams } from '@src/presentation/controllers/survey/add-survey/add-survey-protocols'
import { RealDate, MockDate, mockValidation, mockAddSurveysParams } from'@tests/helpers'


function mockAddSurvey(): AddSurvey {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyParams): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyStub()
}


function mockRequest(): HttpRequest {
  return {
    body: mockAddSurveysParams()
  }
}

type SutTypes = {
  sut: AddSurveyController,
  validationStub: Validation,
  addSurveyStub: AddSurvey
}

function makeSut(): SutTypes {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurveyController' , () => {
  beforeAll(() => {
    (global as any).Date = MockDate;
  })
  afterAll(() => {
    (global as any).Date = RealDate;
  })

  test('Shoul call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request: HttpRequest = mockRequest()
    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Shoud return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValue(new Error())
    const request: HttpRequest = mockRequest()
    const response = await sut.handle(request)

    expect(response.statusCode).toBe(400)
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const request: HttpRequest = mockRequest()
    await sut.handle(request)

    expect(addSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 500 if AddSurvey thows', async () => {
    const { sut, addSurveyStub } = makeSut()
    const error = new Error()
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(error)
    const request: HttpRequest = mockRequest()
    const response = await sut.handle(request)

    expect(response).toEqual(serverError(error))
  })

  test('Should return 204 if success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockRequest())

    expect(response).toEqual(noContent())
  })
})
