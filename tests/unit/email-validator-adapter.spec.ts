import { EmailValidatorAdapter } from "../../src/utils/email-validator-adapter";
import validator from "validator";

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

  test('should return false if the email passed is an empty string', async () => {
    const sut = new EmailValidatorAdapter()

    const isValid = await sut.isValid('');
    expect(isValid).toBe(false);
  })

  test('Should call validator with correct email', async () => {
    const sut = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(sut, "isValid")

    // corfirma que o email passado no método é o mesmo email usado na verificação
    const correct_email = "correct_email@gmail.com"
    await sut.isValid(correct_email)

    expect(isEmailSpy).toHaveBeenCalledWith(correct_email);
  })
})
