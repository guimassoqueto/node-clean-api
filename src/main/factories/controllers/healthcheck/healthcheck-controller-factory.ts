import { type Controller } from '../../../../presentation/protocols'
import { HealthCheckController } from '../../../../presentation/controllers/healthcheck/healthcheck-controller'

export function makeHealthCheckController (): Controller {
  return new HealthCheckController()
}
