import request from 'supertest'
import app from '@src/main/config/app'
import { Request, Response } from 'express'

describe('ContentType Middleware' , () => {
  test('Should return default Content-Type to application/json', async () => {
    app.get('/test-content-type-default', (req: Request, res: Response) => {
      res.send()
    })

    await request(app)
      .get('/test-content-type-default')
      .expect('Content-Type', /json/) // expressão regular indicando que o valor deve possuir a expressão json
  })

  test('Should return Content-Type as xml when forced to it', async () => {
    app.get('/test-content-type-xml', (req: Request, res: Response) => {
      res.type('xml')
      res.send()
    })

    await request(app)
      .get('/test-content-type-xml')
      .expect('Content-Type', /xml/) // expressão regular indicando que o valor deve possuir a expressão json
  })
})