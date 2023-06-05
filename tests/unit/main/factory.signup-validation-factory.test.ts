import { makeSignUpValidation } from "@src/main/factories/controllers/account/signup/signup-validation-factory"
import { ValidationComposite } from "@src/validation/validation-composite"
import { 
  RequiredFieldValidation, 
  FieldsComparisonValidation,
  EmailValidation,
  PasswordValidation
} from "@src/validation/field-validations"
import { EmailValidator, PasswordValidator, Validation } from "@src/presentation/protocols"

jest.mock("@src/validation/validation-composite")

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
