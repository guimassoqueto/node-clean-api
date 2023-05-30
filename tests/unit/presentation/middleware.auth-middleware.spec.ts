import { HttpRequest } from "../../../src/presentation/protocols"
import { AuthMiddleware } from "../../../src/presentation/middlewares/auth-middleware"
import { forbidden } from "../../../src/presentation/helpers/http/http-helper"
import { AccessDeniedError } from "../../../src/errors"

function makeFakeRequest(): HttpRequest {
  return {
    headers: {},
    body: {}
  }
}

describe('AuthMiddleware' , () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const sut = new AuthMiddleware()
    const request = makeFakeRequest()
    delete request.headers
    const response = await sut.handle(request)

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
