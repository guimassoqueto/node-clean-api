import { SignUpControlller } from "@src/presentation/controllers/account/signup/signup-controller";
import { HttpRequest } from "@src/presentation/protocols";
import { badRequest } from "@src/presentation/helpers/http";
import {
  AccountModel,
  AddAccount,
  AddAccountParams,
  AddUnverifiedAccount,
  EmailService,
  EmailVerificationParams,
  EmailVerificationResponse,
  MissingParamError,
  ServerError,
  UnverifiedAccountModel,
  Validation,
} from "@src/presentation/controllers/account/signup/signup-controller-protocols";
import {
  mockAccountModel,
  MockDate,
  mockUnverifiedAccount,
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

function mockAddUnverifiedAccount(): AddUnverifiedAccount {
  class AddUnverifiedAccountStub implements AddUnverifiedAccount {
    async add(accountId: string): Promise<UnverifiedAccountModel> {
      return Promise.resolve(mockUnverifiedAccount());
    }
  }
  return new AddUnverifiedAccountStub();
}

function mockEmailService(): EmailService {
  class EmailServiceStub implements EmailService {
    async sendAccountVerificationEmail(
      emailVerificationParams: EmailVerificationParams,
    ): Promise<EmailVerificationResponse> {
      return Promise.resolve({ statusCode: 200 });
    }
  }

  return new EmailServiceStub();
}

type SutTypes = {
  sut: SignUpControlller;
  addAccountStub: AddAccount;
  validationStub: Validation;
  addUnverifiedAccountStub: AddUnverifiedAccount;
  emailServiceStub: EmailService;
};

// Factory que cria um SignUpController
function makeSut(): SutTypes {
  const validationStub = mockValidation();
  const addAccountStub = mockAddAccount();
  const addUnverifiedAccountStub = mockAddUnverifiedAccount();
  const emailServiceStub = mockEmailService();

  const sut = new SignUpControlller(
    validationStub,
    addAccountStub,
    addUnverifiedAccountStub,
    emailServiceStub,
  );

  return {
    sut,
    addAccountStub,
    validationStub,
    addUnverifiedAccountStub,
    emailServiceStub,
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

  test("Should call addUnverifiedAccount with correct values", async () => {
    const { sut, addUnverifiedAccountStub } = makeSut();
    const addSpy = jest.spyOn(addUnverifiedAccountStub, "add");
    await sut.handle(mockRequest());

    expect(addSpy).toHaveBeenCalledWith(mockAccountModel().id);
  });

  test("Should return 500 if addUnverifiedAccountStub throws", async () => {
    const { sut, addUnverifiedAccountStub } = makeSut();
    const error = new Error("any_error");
    jest.spyOn(addUnverifiedAccountStub, "add").mockRejectedValue(new Error());
    const response = await sut.handle(mockRequest());

    expect(response.statusCode).toBe(500);
  });

  test("Should call emailService.sendAccountVerificationEmail with correct values", async () => {
    const { sut, emailServiceStub } = makeSut();
    const sendAccountVerificationEmailSpy = jest.spyOn(
      emailServiceStub,
      "sendAccountVerificationEmail",
    );
    const fakeRequest = mockRequest();
    await sut.handle(fakeRequest);
    const { email } = fakeRequest.body;

    expect(sendAccountVerificationEmailSpy).toHaveBeenCalledWith({
      email,
      accountToken: mockUnverifiedAccount().accountToken,
    });
  });

  test("Should return 500 if sendAccountVerificationEmail throws", async () => {
    const { sut, emailServiceStub } = makeSut();
    const error = new Error("any_error");
    jest.spyOn(emailServiceStub, "sendAccountVerificationEmail")
      .mockRejectedValue(new Error("sendAccountVerificationEmail error"));
    const response = await sut.handle(mockRequest());

    expect(response.statusCode).toBe(500);
  });
});
