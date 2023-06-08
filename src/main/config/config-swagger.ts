import { type Express } from 'express'
import { noCache } from '@src/main/middlewares'
import swagger from 'swagger-ui-express'
import swaggerDoc from '@src/main/docs'

export default function (app: Express): void {
  app.use('/api-docs', noCache, swagger.serve, swagger.setup(swaggerDoc))
}
