import { type Express } from 'express'
import swagger from 'swagger-ui-express'
import swaggerDoc from '@src/main/docs'

export default function (app: Express): void {
  app.use('/api-docs', swagger.serve, swagger.setup(swaggerDoc))
}
