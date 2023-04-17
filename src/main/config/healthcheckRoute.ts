import { type Express, Router } from 'express'
import healthCheckRoute from '../routes/healthcheck'

export default function (app: Express): void {
  const router = Router()
  app.use('/healthcheck', router)
  healthCheckRoute(router)
}
