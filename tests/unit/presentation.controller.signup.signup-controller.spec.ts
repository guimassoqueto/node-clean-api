import { SignUpControlller } from "../../src/presentation/controllers/signup/signup-controller"
import { AddAccount, AddAccountModel } from "../../src/domain/usecases/add-account"
import { AccountModel } from "../../src/domain/models/account"
import { 
  HttpRequest,
  Validation
} from "../../src/presentation/controllers/signup/signup-controller-protocols"
import { MissingParamError, ServerError } from "../../src/presentation/errors"
import { ok, badRequest } from "../../src/presentation/helpers/http/http-helper"


function makeFakeAccount(): AccountModel {
  return {
    id: "valid_id",
    name: "valid_name",
    email: "valid_email@email.com",
    password: "valid_password",
    verified: true,
    createdAt: new Date()
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
  addAccountStub: AddAccount,
  validationStub: Validation
}

// Factory que cria um SignUpController
function makeSut(): SutTypes {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpControlller(addAccountStub, validationStub);

  return {
    sut,
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
