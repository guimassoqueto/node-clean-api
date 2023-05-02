import { EmailValidator } from "../../src/presentation/protocols";
import { EmailValidation } from "../../src/validation/validations"
import { InvalidParamError } from "../../src/errors";

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

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockImplementation((email: string) => {
      throw new Error()
    })
    
    expect(sut.validate).toThrow()
  })

  test('Should return an error if the email provided is not valid', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const result = sut.validate({email: "invalid_email"})
    
    expect(result).toEqual(new InvalidParamError("email"))
  })
})
