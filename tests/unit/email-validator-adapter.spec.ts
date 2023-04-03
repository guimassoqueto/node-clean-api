import { EmailValidatorAdapter } from "../../src/utils/email-validator-adapter";

describe('Email Validator Adapter' , () => {
  test('should return false if the email passed is invalid', async () => {
    const sut = new EmailValidatorAdapter();
    const isValid = await sut.isValid('invalid_email.com');
    expect(isValid).toBe(false);
  })

  test('should return true if the email passed is valid', async () => {
    const sut = new EmailValidatorAdapter()

    const isValid = await sut.isValid('valid_email@gmail.com');
    expect(isValid).toBe(true);
  })
})
