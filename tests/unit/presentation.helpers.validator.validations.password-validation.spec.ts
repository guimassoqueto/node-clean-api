import { PasswordValidator } from "../../src/presentation/protocols";
import { PasswordValidation } from "../../src/validation/validations" 
import { InvalidParamError } from "../../src/errors";

// Factory que cria um PasswordValidator
function makePasswordValidator(): PasswordValidator {
  // Mock PasswordValidator
  class PasswordValidatorStub implements PasswordValidator {
    public isStrong(password: string): boolean {
      return true;
    }
  }

  return new PasswordValidatorStub();
}

interface sutTypes {
  sut: PasswordValidation,
  passwordValidatorStub: PasswordValidator
}

function makeSut(): sutTypes {
  const passwordValidatorStub = makePasswordValidator()
  const sut = new PasswordValidation("password", passwordValidatorStub)

  return {
    sut,
    passwordValidatorStub
  }
}

// Tests
// 1. PasswordValidator.isStrong receives the correct value as argument
// 2. PasswordValidation throws if PasswordValidator throw
// 3. PasswordValidation return invalid param error in case the password provided isnt strong

describe('Password Validation' , () => {
  test('PasswordValidator should receive the correct value as argument', () => {
    const { sut, passwordValidatorStub } = makeSut()
    const isStrongSpy = jest.spyOn(passwordValidatorStub, "isStrong")
    const input = { password: "valid_password" }
    sut.validate(input)

    expect(isStrongSpy).toHaveBeenCalledWith(input.password)
  })

  test('PasswordValidator should thows if PasswordValidator throws', () => {
    const { sut, passwordValidatorStub } = makeSut()
    jest.spyOn(passwordValidatorStub, "isStrong").mockImplementationOnce((password: string) => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })

  test('PasswordValidator return InvalidParamError if the password provided is not strong', () => {
    const { sut, passwordValidatorStub } = makeSut()
    jest.spyOn(passwordValidatorStub, "isStrong").mockReturnValueOnce(false)
    const result = sut.validate({password: "weak_password"})
    expect(result).toEqual(new InvalidParamError("password"))
  })
})
