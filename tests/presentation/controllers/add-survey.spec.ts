import { AddSurveyController } from '@src/presentation/controllers/survey/add-survey/add-survey-controller'
import { noContent, serverError } from '@src/presentation/helpers/http/http-helper'
import { AddSurvey, AddSurveyParams } from '@src/presentation/controllers/survey/add-survey/add-survey-protocols'
import { ValidationSpy, RealDate, MockDate } from "@tests/presentation/mocks"
import { faker } from '@faker-js/faker'


function mockAddSurvey(): AddSurvey {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}


function mockRequest(): AddSurveyController.Request {
  return {
    question: faker.word.words(),
    answers: [
      {
        image:faker.image.url(),
        answer: faker.word.words()
      }
    ]
  }
}

type SutTypes = {
  sut: AddSurveyController,
  validationSpy: ValidationSpy,
  addSurveyStub: AddSurvey
}

function makeSut(): SutTypes {
  const validationSpy = new ValidationSpy()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationSpy, addSurveyStub);

  return {
    sut,
    validationSpy,
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

  test('Shoul call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  test('Shoud return 400 if validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    validationSpy.result = new Error()
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
  })

  // TODO: converter addSurveyStub para Spy
  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const request = mockRequest()
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({...request, date: new Date()})
  })

  test('Should return 500 if AddSurvey thows', async () => {
    const { sut, addSurveyStub } = makeSut()
    const error = new Error()
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(error)
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(error))
  })

  test('Should return 204 if success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(noContent())
  })
})
