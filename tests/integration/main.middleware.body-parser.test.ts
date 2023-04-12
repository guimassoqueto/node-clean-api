import request from "supertest"
import app from "../../src/main/config/app"
import { Request, Response } from "express"

describe('Body Parser Middleware' , () => {
  test('Should parse body as json', async () => {
    app.post('/test-body-parser', (req: Request, res: Response) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test-body-parser')
      .send({ name: "Guilherme" })
      .expect({ name: "Guilherme" })
  })
})
