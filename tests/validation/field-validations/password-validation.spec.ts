import { PasswordValidation } from '@src/validation/field-validations' 
import { InvalidParamError } from '@src/errors';
import { PasswordValidator } from '@src/validation/protocols';
import { mockPasswordValidator } from '@tests/helpers';


type SutTypes =  {
  sut: PasswordValidation,
  passwordValidatorStub: PasswordValidator
}

function makeSut(): SutTypes {
  const passwordValidatorStub = mockPasswordValidator()
  const sut = new PasswordValidation('password', passwordValidatorStub)

  return {
    sut,
    passwordValidatorStub
  }
}

describe('PasswordValidator' , () => {
  test('PasswordValidator should receive the correct value as argument', () => {
    const { sut, passwordValidatorStub } = makeSut()
    const isStrongSpy = jest.spyOn(passwordValidatorStub, 'isStrong')
    const input = { password: 'valid_password' }
    sut.validate(input)

    expect(isStrongSpy).toHaveBeenCalledWith(input.password)
  })

  test('PasswordValidator should thows if PasswordValidator throws', () => {
    const { sut, passwordValidatorStub } = makeSut()
    jest.spyOn(passwordValidatorStub, 'isStrong').mockImplementationOnce((password: string) => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })

  test('PasswordValidator return InvalidParamError if the password provided is not strong', () => {
    const { sut, passwordValidatorStub } = makeSut()
    jest.spyOn(passwordValidatorStub, 'isStrong').mockReturnValueOnce(false)
    const result = sut.validate({password: 'weak_password'})
    expect(result).toEqual(new InvalidParamError('password'))
  })
})
