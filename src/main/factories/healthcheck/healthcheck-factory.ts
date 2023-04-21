import { type Controller } from '../../../presentation/protocols'
import { HealthCheckController } from '../../../presentation/controllers/healthcheck/healthcheck-controller'
import { LoggingControllerDecorator } from '../../decorators/logging-controller-decorator'
import { LoggingWinstonRepository } from '../../../infra/logger/winston/logging-winston-repository'

export function makeHealthCheckController (): Controller {
  const healthCheckController = new HealthCheckController()
  const loggingRepository = new LoggingWinstonRepository()
  return new LoggingControllerDecorator(healthCheckController, loggingRepository)
}
