import { LoginController } from "@src/presentation/controllers/account/login/login-controller";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "@src/presentation/helpers/http/http-helper";
import { MissingParamError } from "@src/errors";
import { AuthenticationSpy, ValidationSpy } from "@tests/presentation/mocks";
import { faker } from "@faker-js/faker";


type SutTypes = {
  sut: LoginController;
  validationSpy: ValidationSpy;
  authenticationSpy: AuthenticationSpy;
};

function makeSut(): SutTypes {
  const validationSpy = new ValidationSpy();
  const authenticationSpy = new AuthenticationSpy();
  const sut = new LoginController(authenticationSpy, validationSpy);

  return {
    sut,
    authenticationSpy,
    validationSpy,
  };
}

function mockRequest(): LoginController.Request {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

describe("Login Controller", () => {
  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(authenticationSpy.authetication).toStrictEqual(request);
  });

  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationSpy } = makeSut();
    authenticationSpy.result = null;
    const response = await sut.handle(mockRequest());
    expect(response).toEqual(unauthorized());
  });

  test("Should return 500 in authentication throws", async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new Error("Some error");
    jest.spyOn(authenticationSpy, "auth").mockRejectedValueOnce(error);
    const response = await sut.handle(mockRequest());
    expect(response).toEqual(serverError(error));
  });

  test("Should return 200 if authentication succeed", async () => {
    const { sut, authenticationSpy } = makeSut();
    const response = await sut.handle(mockRequest());
    expect(response).toEqual(ok(authenticationSpy.result));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(validationSpy.input).toEqual(request);
  });

  test("Should return 400 if Validation return an error", async () => {
    const { sut, validationSpy } = makeSut();
    const error = new MissingParamError("any_field");
    const request = mockRequest();
    validationSpy.result = error
    const response = await sut.handle(request);
    expect(response).toEqual(badRequest(error));
  });
});
