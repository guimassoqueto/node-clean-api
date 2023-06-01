import { 
  AddSurvey, 
  AddSurveyModel, 
  HttpRequest 
} from "../../../src/presentation/controllers/survey/add-survey/add-survey-protocols"
import { AddSurveyController } from '../../../src/presentation/controllers/survey/add-survey/add-survey-controller'
import { Validation } from '../../../src/presentation/protocols'
import { noContent, serverError } from "../../../src/presentation/helpers/http/http-helper"

// mock Date object
const RealDate = Date;
class MockDate extends RealDate {
  constructor() {
    super('2030-01-01T00:00:00Z');
  }
}

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      createdAt: new Date(),
      question: 'any_question',
      answers: [{
        image: "any-image",
        answer: "any-answer"
      }]
    }
  }
}

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

function makeAddSurvey(): AddSurvey {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyStub()
}

type SutTypes = {
  sut: AddSurveyController,
  validationStub: Validation,
  addSurveyStub: AddSurvey
}

function makeSut(): SutTypes {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('Add Survey Controller' , () => {
  beforeAll(() => {
    (global as any).Date = MockDate;
  })
  afterAll(() => {
    (global as any).Date = RealDate;
  })

  test('Shoul call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, "validate")
    const request: HttpRequest = makeFakeRequest()
    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Shoud return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, "validate").mockReturnValue(new Error())
    const request: HttpRequest = makeFakeRequest()
    const response = await sut.handle(request)

    expect(response.statusCode).toBe(400)
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, "add")
    const request: HttpRequest = makeFakeRequest()
    await sut.handle(request)

    expect(addSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 500 if AddSurvey thows', async () => {
    const { sut, addSurveyStub } = makeSut()
    const error = new Error()
    jest.spyOn(addSurveyStub, "add").mockRejectedValueOnce(error)
    const request: HttpRequest = makeFakeRequest()
    const response = await sut.handle(request)

    expect(response).toEqual(serverError(error))
  })

  test('Should return 204 if success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(noContent())
  })
})
