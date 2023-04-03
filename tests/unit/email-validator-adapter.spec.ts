import { EmailValidatorAdapter } from "../../src/utils/email-validator-adapter";

describe('Email Validator Adapter' , () => {
  test('shoul return false if validator return false', async () => {
    const sut = new EmailValidatorAdapter()

    const isValid = await sut.isValid('invalid_email.com');
    expect(isValid).toBe(false);
  })
})
