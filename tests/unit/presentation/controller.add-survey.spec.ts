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

describe('Add Survey Controller' , () => {
  test('Shoul call validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate(input: any): Error | null {
        return null
      }
    }
    const validationStub = new ValidationStub()
    const sut = new AddSurveyController(validationStub)
    const validateSpy = jest.spyOn(validationStub, "validate")
    const request: HttpRequest = makeFakeRequest()
    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
})
