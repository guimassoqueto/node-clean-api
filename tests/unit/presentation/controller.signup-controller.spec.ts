import { SignUpControlller } from "@src/presentation/controllers/account/signup/signup-controller";
import { HttpRequest } from "@src/presentation/protocols";
import { badRequest } from "@src/presentation/helpers/http";
import {
  AccountModel,
  AddAccount,
  AddAccountParams,
  MissingParamError,
  ServerError,
  Validation,
} from "@src/presentation/controllers/account/signup/signup-controller-protocols";
import {
  mockAccountModel,
  MockDate,
  mockValidation,
  RealDate,
} from "@tests/helpers";

function mockAddAccount(): AddAccount {
  class AddAccountStub implements AddAccount {
    public async add(account: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }

  return new AddAccountStub();
}


type SutTypes = {
  sut: SignUpControlller;
  addAccountStub: AddAccount;
  validationStub: Validation;
};

// Factory que cria um SignUpController
function makeSut(): SutTypes {
  const validationStub = mockValidation();
  const addAccountStub = mockAddAccount();

  const sut = new SignUpControlller(
    validationStub,
    addAccountStub   
  );

  return {
    sut,
    addAccountStub,
    validationStub  
  };
}

function mockRequest(): HttpRequest {
  return {
    body: {
      name: "any-name",
      email: "any-email@email.com",
      password: "any-password",
      passwordConfirmation: "any-password",
    },
  };
}

describe("SignUpControlller", () => {
  beforeAll(() => {
    (global as any).Date = MockDate;
  });
  afterAll(() => {
    (global as any).Date = RealDate;
  });

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  test("Should return 500 when AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockRejectedValue(new ServerError());
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 200 when the request body is valid", async () => {
    const { sut } = makeSut();
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 400 if Validation return an error", async () => {
    const { sut, validationStub } = makeSut();
    const error = new MissingParamError("any_field");
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(error);
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(error));
  });

});
