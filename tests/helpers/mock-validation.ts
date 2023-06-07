import { EmailValidator, PasswordValidator } from "@src/validation/protocols"
import { Validation } from "@src/validation/validation"


/**
 * Mock Validation class
 */
export function mockValidation(): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}


/**
 * Mock PasswordValidator class 
 */
export function mockPasswordValidator(): PasswordValidator {
  class PasswordValidatorStub implements PasswordValidator {
    isStrong (password: string) {
      return true
    }
  }
  return new PasswordValidatorStub()
}


/**
 * Mock EmailValidator class
 */
export function mockEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string) {
      return true
    }
  }
  return new EmailValidatorStub()
}
