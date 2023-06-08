import { type Express, Router } from 'express'
import healthCheckRoute from '@src/main/routes/healthcheck'

export default function (app: Express): void {
  const router = Router()
  app.use('/health', router)
  healthCheckRoute(router)
}
