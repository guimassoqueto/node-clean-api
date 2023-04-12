import { makeLoginValidation } from "../../src/main/factories/login/login-validation"
import { ValidationComposite } from "../../src/presentation/helpers/validators/validation-composite"
import { 
  EmailValidation,
  RequiredFieldValidation
} from "../../src/presentation/helpers/validators/validations"
import { EmailValidator, Validation } from "../../src/presentation/protocols"

jest.mock("../../src/presentation/helpers/validators/validation-composite")

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string) {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory' , () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const requiredField of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(requiredField))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
