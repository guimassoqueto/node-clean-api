import { HttpRequest } from "../../../src/presentation/controllers/survey/add-survey-protocols"
import { AddSurveyController } from '../../../src/presentation/controllers/survey/add-survey-controller'
import { Validation } from '../../../src/presentation/protocols'

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      question: 'any_question',
      answer: [{
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

type SutTypes = {
  sut: AddSurveyController,
  validationStub: Validation
}

function MakeSut(): SutTypes {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub);

  return {
    sut,
    validationStub
  }
}

describe('Add Survey Controller' , () => {
  test('Shoul call validation with correct values', async () => {
    const { sut, validationStub } = MakeSut()
    const validateSpy = jest.spyOn(validationStub, "validate")
    const request: HttpRequest = makeFakeRequest()
    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
})
