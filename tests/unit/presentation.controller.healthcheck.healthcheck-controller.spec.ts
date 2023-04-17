import { HealthCheckController } from "../../src/presentation/controllers/healthcheck/healthcheck-controller"

describe('Healthcheck Controller' , () => {
  test('Should return 500 if LoginController Throws', async () => {
    const sut = new HealthCheckController()
    const error = new Error()
    jest.spyOn(sut, "handle").mockRejectedValue(error)
    const promise = sut.handle({ body: null })

    await expect(promise).rejects.toThrow()
  })
})
