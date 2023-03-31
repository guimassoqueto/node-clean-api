import { SignUpControlller } from "../src/presentation/controllers"
import { IHttpRequest, EmailValidator, PasswordValidator } from "../src/presentation/protocols";
import { MissingParamError, InvalidParamError, ServerError } from "../src/presentation/errors";

interface SutTypes {
  sut: SignUpControlller,
  emailValidatorStub: EmailValidator,
  passwordValidatorStub: PasswordValidator
}

// Factory que cria um SignUpController
function makeSut(): SutTypes {
  
  // Mock Email Stub 
  class EmailValidatorStub implements EmailValidator {
    public isValid(email: string): boolean {
      return true
    }
  }

  // Mock Password Stub
  class PasswordValidatorStub implements PasswordValidator {
    isStrong(password: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub();
  const passwordValidatorStub = new PasswordValidatorStub();
  const sut = new SignUpControlller(emailValidatorStub, passwordValidatorStub);

  return {
    sut,
    emailValidatorStub,
    passwordValidatorStub
  }
}

describe('Sign Up Controlller' , () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  })

  test('Should return 400 if no email is provided', () => { 
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  })

  test('Should return 400 if no password is provided', () => { 
    const { sut } = makeSut();

    const httpRequest: IHttpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  })

  test('Should return 400 if no passwordConfirmation is provided', () => { 
    const { sut } = makeSut();

    const httpRequest: IHttpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"));
  })

  test('Should return 400 if the provided email is invalid', () => { 
    const { sut, emailValidatorStub } = makeSut();

    // jest espiona o método isValid da classe emailValidatorStub e retorna um valor pre-definido sempre que for chamado
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  })

  test('Should call EmailValidator with correct email provided by request', () => { 
    const { sut, emailValidatorStub } = makeSut();

    // Espiona o comportamento do método isValid dentro da classe emailValidatorStub
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")

    const bodyEmail = "any_email@email.com"
    const httpRequest = {
      body: {
        name: "any_name",
        email: bodyEmail,
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(bodyEmail);
  })

  test('Should return 400 if the provided the password isn\'t strong', () => { 
    const { sut, passwordValidatorStub } = makeSut();
    jest.spyOn(passwordValidatorStub, "isStrong").mockReturnValueOnce(false);

    const httpRequest: IHttpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("password"));
  })

  test('Should return 500 if EmailValidator throws', () => { 
    
    // Mock Email Stub 
    class EmailValidatorStub implements EmailValidator {

      // Mock the method to return error
      public isValid(email: string): boolean {
        throw Error()
      }
    }

    // Mock Password Stub
    class PasswordValidatorStub implements PasswordValidator {
      isStrong(password: string): boolean {
        return true
      }
    }

    const emailValidatorStub = new EmailValidatorStub();
    const passwordValidatorStub = new PasswordValidatorStub();
    const sut = new SignUpControlller(emailValidatorStub, passwordValidatorStub);

    const httpRequest: IHttpRequest = {
      body: {
        name: "any_name",
        email: 123, // try error
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const response = sut.handle(httpRequest)

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError())
  })

})
