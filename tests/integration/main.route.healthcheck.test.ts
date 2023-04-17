import app from "../../src/main/config/app"
import request from "supertest"

describe('HealthCheck' , () => {

  describe('GET /healthcheck' , () => {
    test('Should return 200 on healthcheck', async () => {
      await request(app)
        .get('/healthcheck')
        .send()
        .expect(200)
    })
  })
})
