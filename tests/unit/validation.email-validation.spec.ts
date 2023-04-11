import { EmailValidator } from "../../src/presentation/protocols";
import { EmailValidation } from "../../src/presentation/helpers/validators/validations"
import { InvalidParamError } from "../../src/presentation/errors";

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface sutTypes {
  sut: EmailValidation,
  emailValidatorStub: EmailValidator
}

function makeSut(): sutTypes {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation' , () => {
  test('Should EmailValidator is called with correct value', () => {
    const { sut, emailValidatorStub } = makeSut()
    const spyIsValid = jest.spyOn(emailValidatorStub, "isValid")
    const input = { email: "valid_email@email.com" }
    sut.validate(input)

    expect(spyIsValid).toHaveBeenCalledWith(input.email)
  })

})
