import { PasswordValidator } from "../../../src/presentation/protocols"
import { PasswordValidatorAdapter } from "../../../src/infra/validator"

// Factory for PasswordValidatorAdapter
function makeSut(): PasswordValidator {
  const passwordValidatorStub = new PasswordValidatorAdapter();
  return passwordValidatorStub;
}

describe('PasswordValidatorAdapter', () => {
  test('Should return false if the provided password is weak', async () => {
    const sut = makeSut();
    const isStrongPassword = await sut.isStrong("password123");
    expect(isStrongPassword).toBe(false)
  })

  test('Should return true if the provided password is strong', async () => {
    const sut = makeSut();
    const isStrongPassword = await sut.isStrong("#!@1QWrt34 !@");
    expect(isStrongPassword).toBe(true)
  })

  test('Should return true if the provided password by the user is the same as used by isStrong', async () => {
    const sut = makeSut();
    const spiedMethod = jest.spyOn(sut, "isStrong")

    const correctPassword = "some_password"
    await sut.isStrong(correctPassword)

    expect(spiedMethod).toHaveBeenCalledWith(correctPassword)
  })
})
