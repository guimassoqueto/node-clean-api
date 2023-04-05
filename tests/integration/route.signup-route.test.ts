import request from "supertest"
import app from "../../src/main/config/app"

describe('SignUp Route' , () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: "Guilherme",
        email: "guilhermemassoqueto@gmail.com",
        password: "###!!!123GGGaaa",
        passwordConfirmation: "###!!!123GGGaaa"
      })
      .expect(200)
  })
})
