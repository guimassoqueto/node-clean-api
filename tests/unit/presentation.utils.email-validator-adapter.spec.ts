import { EmailValidatorAdapter } from "../../src/utils/email-validator-adapter";

// Factory que cria um EmailValidator
function makeSut(): EmailValidatorAdapter {
  const emailValidatorStub = new EmailValidatorAdapter()
  return emailValidatorStub;
}

describe('Email Validator Adapter' , () => {
  test('should return false if the email passed is invalid', async () => {
    const sut = makeSut();
    const isValid = sut.isValid('invalid_email.com');
    expect(isValid).toBe(false);
  })

  test('should return true if the email passed is valid', async () => {
    const sut = makeSut()

    const isValid = sut.isValid('valid_email@gmail.com')
    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', async () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(sut, "isValid")

    // corfirma que o email passado no método é o mesmo email usado na verificação
    const correct_email = "correct_email@gmail.com"
    sut.isValid(correct_email)

    expect(isEmailSpy).toHaveBeenCalledWith(correct_email)
  })
})
