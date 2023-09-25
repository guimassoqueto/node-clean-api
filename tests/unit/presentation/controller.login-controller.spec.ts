import { LoginController } from "@src/presentation/controllers/account/login/login-controller";
import {
  AuthenticationParams,
  Validation,
} from "@src/presentation/controllers/account/login/login-controller-protocols";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "@src/presentation/helpers/http/http-helper";
import { HttpRequest } from "@src/presentation/protocols";
import { MissingParamError } from "@src/errors";
import { AuthenticationSpy, mockValidation } from "@tests/helpers";

function mockAuthenticationParams(): AuthenticationParams {
  return {
    email: "any-email",
    password: "any-password",
  };
}

type SutTypes = {
  sut: LoginController;
  validationStub: Validation;
  authenticationSpy: AuthenticationSpy;
};

function makeSut(): SutTypes {
  const validationStub = mockValidation();
  const authenticationSpy = new AuthenticationSpy();
  const sut = new LoginController(authenticationSpy, validationStub);

  return {
    sut,
    authenticationSpy,
    validationStub,
  };
}

function mockRequest(): HttpRequest {
  return {
    body: mockAuthenticationParams(),
  };
}

describe("Login Controller", () => {
  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(authenticationSpy.authetication).toStrictEqual(httpRequest.body);
  });

  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, "auth").mockResolvedValueOnce(null);
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  test("Should return 500 in authentication throws", async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new Error("Some error");
    jest.spyOn(authenticationSpy, "auth").mockRejectedValueOnce(error);
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(error));
  });

  test("Should return 200 if authentication succeed", async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(authenticationSpy.AuthenticationModel));
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
