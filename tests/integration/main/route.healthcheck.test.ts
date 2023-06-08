import app from '@src/main/config/app'
import request from 'supertest'

describe('Health Route' , () => {

  describe('GET /health' , () => {
    test('Should return 200 on healthcheck', async () => {
      await request(app)
        .get('/health')
        .send()
        .expect(200)
    })
  })
})
