import { type Controller } from '@src/presentation/protocols'
import { HealthCheckController } from '@src/presentation/controllers/healthcheck/healthcheck-controller'

export function makeHealthCheckController (): Controller {
  return new HealthCheckController()
}
