import { makeSignUpValidation } from "../../src/main/factories/signup-validation"
import { ValidationComposite } from "../../src/presentation/helpers/validators/validation-composite"
import { 
  RequiredFieldValidation, 
  FieldsComparisonValidation 
} from "../../src/presentation/helpers/validators/validations/"
import { Validation } from "../../src/presentation/helpers/validators/validation"

jest.mock("../../src/presentation/helpers/validators/validation-composite")

describe('SignUpValidation Factory' , () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const requiredField of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(requiredField))
    }
    validations.push(new FieldsComparisonValidation('password', 'passwordConfirmation'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
