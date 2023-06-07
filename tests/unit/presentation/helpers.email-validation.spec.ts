import { InvalidParamError } from '@src/errors';
import { EmailValidation } from '@src/validation/field-validations';
import { EmailValidator } from '@src/validation/protocols';
import { mockEmailValidator } from '@tests/helpers';


type SutTypes =  {
  sut: EmailValidation,
  emailValidatorStub: EmailValidator
}

function makeSut(): SutTypes {
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailValidator' , () => {
  test('Should EmailValidator is called with correct value', () => {
    const { sut, emailValidatorStub } = makeSut()
    const spyIsValid = jest.spyOn(emailValidatorStub, 'isValid')
    const input = { email: 'valid_email@email.com' }
    sut.validate(input)

    expect(spyIsValid).toHaveBeenCalledWith(input.email)
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation((email: string) => {
      throw new Error()
    })
    
    expect(sut.validate).toThrow()
  })

  test('Should return an error if the email provided is not valid', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const result = sut.validate({email: 'invalid_email'})
    
    expect(result).toEqual(new InvalidParamError('email'))
  })
})
