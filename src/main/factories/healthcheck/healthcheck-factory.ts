import { Controller } from "../../../presentation/protocols";
import { HealthCheckController } from "../../../presentation/controllers/healthcheck/healthcheck-controller";
import { LoggingControllerDecorator } from "../../decorators/logging-controller-decorator";
import { LoggingMongoRepository } from "../../../infra/db/mongodb/logging/logging-mongo-repository";

export function makeHealthCheckController (): Controller {
  const healthCheckController = new HealthCheckController()
  const loggingErrorRepository = new LoggingMongoRepository()
  return new LoggingControllerDecorator(healthCheckController, loggingErrorRepository)
}