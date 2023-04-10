import { SignUpControlller } from "../../src/presentation/controllers/signup/signup-controller"
import { AddAccount, AddAccountModel } from "../../src/domain/usecases/add-account"
import { AccountModel } from "../../src/domain/models/account"
import { 
  EmailValidator, 
  PasswordValidator, 
  HttpRequest,
  Validation
} from "../../src/presentation/controllers/signup/signup-protocols"
import { MissingParamError, InvalidParamError, ServerError } from "../../src/presentation/errors"
import { ok, serverError, badRequest } from "../../src/presentation/helpers/http-helper"

// Factory que cria um EmailValidator
function makeEmailValidator(): EmailValidator {
  // Mock EmailValidator 
  class EmailValidatorStub implements EmailValidator {
    public async isValid(email: string): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
  }

  return new EmailValidatorStub();
}

// Factory que cria um PasswordValidator
function makePasswordValidator(): PasswordValidator {
  // Mock PasswordValidator
  class PasswordValidatorStub implements PasswordValidator {
    public async isStrong(password: string): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
  }

  return new PasswordValidatorStub();
}

function makeFakeAccount(): AccountModel {
  return {
    id: "valid_id",
    name: "valid_name",
    email: "valid_email@email.com",
    password: "valid_password"
  }
}

// Factory que cria um AddAccount
function makeAddAccount(): AddAccount {
  // Mock AddAccountStub
  class AddAccountStub implements AddAccount {
    public async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub();
}

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpControlller,
  emailValidatorStub: EmailValidator,
  passwordValidatorStub: PasswordValidator,
  addAccountStub: AddAccount,
  validationStub: Validation
}

// Factory que cria um SignUpController
function makeSut(): SutTypes {
  const emailValidatorStub = makeEmailValidator()
  const passwordValidatorStub = makePasswordValidator()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpControlller(emailValidatorStub, passwordValidatorStub, addAccountStub, validationStub);

  return {
    sut,
    emailValidatorStub,
    passwordValidatorStub,
    addAccountStub,
    validationStub
  }
}

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
      passwordConfirmation: "valid_password"
    }
  }
}

describe('Sign Up Controlller' , () => {
  // test('Should return 400 if no name is provided', async () => {
  //   const { sut } = makeSut();
  //   const httpRequest = makeFakeRequest()
  //   delete httpRequest.body.name
  //   const httpResponse = await sut.handle(httpRequest)

  //   expect(httpResponse).toEqual(badRequest(new MissingParamError("name")))
  // })

  // test('Should return 400 if name is provided as an empty string', async () => {
  //   const { sut } = makeSut();
  //   const httpRequest = makeFakeRequest()
  //   httpRequest.body.name = ""
  //   const httpResponse = await sut.handle(httpRequest)

  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError("name")))
  // })

  // test('Should return 400 if name is provided with less than 3 lettes', async () => {
  //   const { sut } = makeSut();
  //   const httpRequest = makeFakeRequest()
  //   httpRequest.body.name = "ab"
  //   const httpResponse = await sut.handle(httpRequest)

  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError("name")))
  // })

  // test('Should return 400 if no email is provided', async () => { 
  //   const { sut } = makeSut();
  //   const httpRequest = makeFakeRequest()
  //   delete httpRequest.body.email
  //   const httpResponse = await sut.handle(httpRequest)

  //   expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
  // })

  // test('Should return 400 if no password is provided', async () => { 
  //   const { sut } = makeSut()
  //   const httpRequest = makeFakeRequest()
  //   delete httpRequest.body.password
  //   const httpResponse = await sut.handle(httpRequest)

  //   expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
  // })

  // test('Should return 400 if no passwordConfirmation is provided', async () => { 
  //   const { sut } = makeSut();
  //   const httpRequest = makeFakeRequest()
  //   delete httpRequest.body.passwordConfirmation
  //   const httpResponse = await sut.handle(httpRequest)

  //   expect(httpResponse).toEqual(badRequest(new MissingParamError("passwordConfirmation")))
  // })

  // test('Should return 400 if the provided email is invalid', async () => { 
  //   const { sut, emailValidatorStub } = makeSut()
  //   // jest espiona o método isValid da classe emailValidatorStub e retorna um valor pre-definido sempre que for chamado
  //   jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(new Promise(resolve => resolve(false)));
  //   const httpRequest = makeFakeRequest()
  //   httpRequest.body.email = "invalid_mail.com"
  //   const httpResponse = await sut.handle(httpRequest)

  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")))
  // })

  // test('Should call EmailValidator with correct email provided by request', async () => { 
  //   const { sut, emailValidatorStub } = makeSut();
  //   // Espiona o comportamento do método isValid dentro da classe emailValidatorStub
  //   const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")
  //   const bodyEmail = "any_email@email.com"
  //   const httpRequest = makeFakeRequest()
  //   httpRequest.body.email = bodyEmail
  //   await sut.handle(httpRequest);

  //   expect(isValidSpy).toHaveBeenCalledWith(bodyEmail);
  // })

  // test('Should return 400 if the provided the password isn\'t strong', async () => { 
  //   const { sut, passwordValidatorStub } = makeSut();
  //   jest.spyOn(passwordValidatorStub, "isStrong").mockReturnValueOnce(new Promise(result => result(false)));
  //   const weakBodyPassword = "password123"
  //   const httpRequest = makeFakeRequest()
  //   httpRequest.body.password = weakBodyPassword
  //   httpRequest.body.passwordConfirmation = httpRequest.body.password
  //   const httpResponse = await sut.handle(httpRequest);

  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError("password")));
  // })

  // test('Should return 500 if EmailValidator throws', async () => { 
  //   const { sut, emailValidatorStub } = makeSut();
  //   // mockando a implementação do método isValid  da classe emailValidatorStub para jogar um erro quando for chamada
  //   jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce((email: string) => { 
  //     return new Promise((_, rej) => rej(new ServerError()))
  //   })
  //   const httpRequest = makeFakeRequest()
  //   const httpResponse = await sut.handle(httpRequest)

  //   expect(httpResponse).toEqual(serverError(new ServerError()))
  // })

  // test('should return error if password and passwordConfirmation are different', async () => {
  //   const { sut } = makeSut();
  //   const httpRequest = makeFakeRequest()
  //   httpRequest.body.passwordConfirmation = ")(*098POIpoi"
  //   const httpResponse = await sut.handle(httpRequest)

  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError("passwordConfirmation")));
  // })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add")
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({ 
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    });
  })

  test('Should return 500 when AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, "add").mockImplementationOnce((account: AddAccountModel) => { 
      return new Promise((_, reject) => reject(new ServerError()))
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 when the request body is valid', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, "validate")
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  })

  test('Should return 400 if Validation return an error', async () => {
    const { sut,validationStub } = makeSut()
    const error = new MissingParamError("any_field")
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(error)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(error))
  })

})
