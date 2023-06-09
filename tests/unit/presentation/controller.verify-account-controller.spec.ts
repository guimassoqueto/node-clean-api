import { AccountVerification } from "@src/domain/usecases/account/account-verification";
import { VerifyAccountController } from "@src/presentation/controllers/account/verify-account/verify-accout-controller";
import { AccountAlreadyVerifiedError } from "@src/errors";
import { HttpRequest } from "@src/presentation/protocols";
import { Validation } from "@src/validation/validation";
import { mockValidation } from "@tests/helpers";

function mockRequest(): HttpRequest {
  return {
    query: {
      accountToken: "any-account-token",
    },
    body: {},
  };
}

function mockAccountVerification(): AccountVerification {
  class AccountVerificationStub implements AccountVerification {
    async verify(accountToken: string): Promise<string | null> {
      return Promise.resolve("any-token");
    }
  }
  return new AccountVerificationStub();
}

type SutTypes = {
  sut: VerifyAccountController;
  validationStub: Validation;
  accountVerificationStub: AccountVerification;
};

function makeSut(): SutTypes {
  const validationStub = mockValidation();
  const accountVerificationStub = mockAccountVerification();
  const sut = new VerifyAccountController(
    validationStub,
    accountVerificationStub,
  );

  return {
    sut,
    validationStub,
    accountVerificationStub,
  };
}

describe("VerifyAccountController", () => {
  test("Should return 400 if accountToken param isnt provided", async () => {
    const { sut, validationStub } = makeSut();
    const error = new Error("any error");
    jest.spyOn(validationStub, "validate").mockReturnValue(error);
    const request = mockRequest();
    delete request.query.accountToken;
    const response = await sut.handle(request);

    expect(request.query.accountToken).toBeFalsy();
    expect(response.statusCode).toBe(400);
  });

  test("Should return 500 if validation throws", async () => {
    const { sut, validationStub } = makeSut();
    const error = new Error("any error");
    jest.spyOn(validationStub, "validate").mockImplementationOnce(() => {
      throw error;
    });
    const response = await sut.handle(mockRequest());

    expect(response.statusCode).toBe(500);
  });

  test("Should call accountVerification.verify with correct values ", async () => {
    const { sut, accountVerificationStub } = makeSut();
    const spyVerify = jest.spyOn(accountVerificationStub, "verify");
    const request = mockRequest();
    await sut.handle(request);

    expect(spyVerify).toHaveBeenCalledWith(request.query.accountToken);
  });

  test("Should return 500 if verify throws", async () => {
    const { sut, accountVerificationStub } = makeSut();
    jest.spyOn(accountVerificationStub, "verify").mockImplementationOnce(() => {
      throw new Error("any error");
    });
    const response = await sut.handle(mockRequest());

    expect(response.statusCode).toBe(500);
  });

  test("Should return 404 if the token passed is invalid/expired", async () => {
    const { sut, accountVerificationStub } = makeSut();
    jest.spyOn(accountVerificationStub, "verify").mockResolvedValue(null);
    const response = await sut.handle(mockRequest());

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual(new AccountAlreadyVerifiedError());
  });

  test("Should return 200 if everything works as expected", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(mockRequest());

    expect(response.statusCode).toBe(200);
  });
});
