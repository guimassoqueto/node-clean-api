import { AuthMiddleware } from "@src/presentation/middlewares/auth-middleware";
import {
  AccessDeniedError,
} from "@src/presentation/middlewares/auth-middleware-protocols";
import {
  forbidden,
  ok,
  serverError,
} from "@src/presentation/helpers/http/http-helper";
import { LoadAccountByTokenSpy } from "@tests/presentation/mocks";
import { faker } from "@faker-js/faker";


const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: faker.string.uuid()
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)
  return {
    sut,
    loadAccountByTokenSpy
  }
}

describe("AuthMiddleware", () => {
  test("Should return 403 if no x-access-token exists in headers", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({});
    expect(response).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should call LoadAccountByToken with correct accessToken", async () => {
    const role = "any_role";
    const { sut, loadAccountByTokenSpy } = makeSut(role);
    const request = mockRequest();
    await sut.handle(request);
    expect(loadAccountByTokenSpy.accessToken).toEqual(request.accessToken);
    expect(loadAccountByTokenSpy.role).toEqual(role)
  });

  test("Should return 403 if LoadAccountByToken return null", async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    loadAccountByTokenSpy.result = null
    const request = mockRequest();
    const response = await sut.handle(request);

    expect(response).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should return 200 if LoadAccountByToken return an account", async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    const request = mockRequest();
    const response = await sut.handle(request);
    expect(response).toEqual(ok({ accountId: loadAccountByTokenSpy.result?.id }));
  });

  test("Should return 500 if LoadAccountByToken throws", async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    const error = new Error("any-error");
    jest.spyOn(loadAccountByTokenSpy, "load").mockRejectedValueOnce(error);
    const request = mockRequest();
    const response = await sut.handle(request);

    expect(response).toEqual(serverError(error));
  });
});
