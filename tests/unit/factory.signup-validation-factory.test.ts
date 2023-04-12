import { makeSignUpValidation } from "../../src/main/factories/signup/signup-validation"
import { ValidationComposite } from "../../src/presentation/helpers/validators/validation-composite"
import { 
  RequiredFieldValidation, 
  FieldsComparisonValidation,
  EmailValidation,
  PasswordValidation
} from "../../src/presentation/helpers/validators/validations/"
import { Validation } from "../../src/presentation/helpers/validators/validation"
import { EmailValidator, PasswordValidator } from "../../src/presentation/protocols"

jest.mock("../../src/presentation/helpers/validators/validation-composite")

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string) {
      return true
    }
  }
  return new EmailValidatorStub()
}

function makePasswordValidator(): PasswordValidator {
  class PasswordValidatorStub implements PasswordValidator {
    isStrong (password: string) {
      return true
    }
  }
  return new PasswordValidatorStub()
}

describe('SignUpValidation Factory' , () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const requiredField of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(requiredField))
    }
    validations.push(new FieldsComparisonValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    validations.push(new PasswordValidation("password", makePasswordValidator()))
    
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
