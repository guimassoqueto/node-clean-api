import { SignUpControlller } from "../src/presentation/controllers/signup.controller"
import { MissingParamError } from "../src/presentation/errors/missing-param-error";
import { InvalidParamError } from "../src/presentation/errors/invalid-param-error";
import { IHttpRequest } from "../src/presentation/protocols/http";
import { EmailValidator } from "../src/presentation/protocols/email-validator";

interface SutTypes {
  sut: SignUpControlller,
  emailValidatorStub: EmailValidator
}

// Factory que cria um SignUpController
function makeSut(): SutTypes {
  
  // Mock Stub 
  class EmailValidatorStub implements EmailValidator {
    public isValid(email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpControlller(emailValidatorStub);

  return {
    sut,
    emailValidatorStub
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

})
