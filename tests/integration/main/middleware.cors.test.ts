import request from "supertest"
import app from "@src/main/config/app"
import { Request, Response } from "express"

describe('Cors Middleware' , () => {
  test('Should enable cors', async () => {
    app.get('/test-cors', (req: Request, res: Response) => {
      res.json()
    })

    await request(app)
      .get('/test-cors')
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Methods' , '*')
      .expect('Access-Control-Allow-Headers' , '*')
  })
})
