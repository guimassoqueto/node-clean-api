import request from 'supertest'
import app from '@src/main/config/app'
import { Request, Response } from 'express'
import { noCache } from '@src/main/middlewares'

describe('NoCache Middleware' , () => {
  test('Should disable cache', async () => {
    app.get('/test-cache', noCache, (req: Request, res: Response) => {
      res.send()
    })

    await request(app)
      .get('/test-cache')
      .expect('Cache-Control', 'no-cache, no-store, must-revalidate')
      .expect('Expires', '0')
  })
})
