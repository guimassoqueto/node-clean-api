import { PasswordValidator } from "../../src/presentation/protocols"
import { PasswordValidatorAdapter } from "../../src/utils/password-validator-adapter"

// Factory for PasswordValidatorAdapter
function makeSut(): PasswordValidator {
  const passwordValidatorStub = new PasswordValidatorAdapter();
  return passwordValidatorStub;
}

describe('PasswordValidatorAdapter', () => {
  test('Should return false if the provided password is weak', async () => {
    const sut = makeSut();
    const isStrongPassword = await sut.isStrong("password123");
    expect(isStrongPassword).toBe(false);
  })
})
