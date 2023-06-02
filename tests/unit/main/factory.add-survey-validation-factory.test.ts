import { makeAddSurveyValidation } from "@src/main/factories/controllers/surveys/add-survey/add-survey-validation-factory"
import { ValidationComposite } from "@src/validation/validation-composite"
import { RequiredFieldValidation } from "@src/validation/validations"
import { Validation } from "@src/presentation/protocols"

jest.mock("@src/validation/validation-composite")

describe('makeAddSurveyValidation' , () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }    
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
