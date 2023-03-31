import SignUpControlller from "../src/presentation/controllers/signup/signup-controller"
import { AddAccount, AddAccountModel } from "../src/domain/usecases/add-account"
import { AccountModel } from "../src/domain/models/account"
import { EmailValidator, PasswordValidator, HttpRequest } from "../src/presentation/controllers/signup/signup-protocols"
import { MissingParamError, InvalidParamError, ServerError } from "../src/presentation/errors"


// Factory que cria um EmailValidator
function makeEmailValidator(): EmailValidator {
  // Mock EmailValidator 
  class EmailValidatorStub implements EmailValidator {
    public isValid(email: string) {
      return true;
    }
  }

  return new EmailValidatorStub();
}

// Factory que cria um PasswordValidator
function makePasswordValidator(): PasswordValidator {
  // Mock PasswordValidator
  class PasswordValidatorStub implements PasswordValidator {
    public isStrong(password: string) {
      return true;
    }
  }

  return new PasswordValidatorStub();
}

// Factory que cria um AddAccount
function makeAddAccount(): AddAccount {
  // Mock AddAccountStub
  class AddAccountStub implements AddAccount {
    public add(account: AddAccountModel): AccountModel {
      const fakeAccount: AccountModel = {
        id: "valid_id",
        name: account.name,
        email: account.email,
        password: account.password
      }

      return fakeAccount
    }
  }

  return new AddAccountStub();
}

interface SutTypes {
  sut: SignUpControlller,
  emailValidatorStub: EmailValidator,
  passwordValidatorStub: PasswordValidator,
  addAccountStub: AddAccount
}

// Factory que cria um SignUpController
function makeSut(): SutTypes {
  
  const emailValidatorStub = makeEmailValidator()
  const passwordValidatorStub = makePasswordValidator()
  const addAccountStub = makeAddAccount()

  const sut = new SignUpControlller(emailValidatorStub, passwordValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    passwordValidatorStub,
    addAccountStub
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

  test('Should return 400 if name is provided as an empty string', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("name"));
  })

  test('Should return 400 if name is provided with less than 3 lettes', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "Ab",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("name"));
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

    const httpRequest: HttpRequest = {
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

    const httpRequest: HttpRequest = {
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

    const httpRequest: HttpRequest = {
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
    const { sut, emailValidatorStub } = makeSut();
    // mockando a implementação do método isValid  da classe emailValidatorStub para jogar um erro quando for chamada
    jest.spyOn(emailValidatorStub, "isValid").mockImplementation((email: string) => { throw new ServerError() } )
    
    // // Mock Email Stub com o método isValid emitindo erro
    // class EmailValidatorStub implements EmailValidator {

    //   // Mock the method to return error
    //   public isValid(email: string): boolean {
    //     throw Error()
    //   }
    // }
    // const sut = new SignUpControlller(emailValidatorStub, passwordValidatorStub);

    // const emailValidatorStub = new EmailValidatorStub();
    const passwordValidatorStub = makePasswordValidator();
    
    const httpRequest: HttpRequest = {
      body: {
        name: "any_name",
        email: "email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return error if password and passwordConfirmation are different', () => {
    const { sut } = makeSut();

    const httpRequest: HttpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password_different"
      }
    }

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("passwordConfirmation"));
  })

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add")

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith({ 
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password"
    });
  })

  test('Should return 500 when AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce((account: AddAccountModel) => { throw new ServerError() })

    const httpRequest: HttpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })

  test('Should return 200 when the request body is valid', () => {
    const { sut } = makeSut();

    const httpRequest: HttpRequest = {
      body: {
        name: "valid_name",
        email: "gaymen@email.com",
        password: "valid_password",
        passwordConfirmation: "valid_password",
      }
    }

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "gaymen@email.com",
      password: "valid_password",
    })

  })
})
