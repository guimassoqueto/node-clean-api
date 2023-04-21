import { type LoggingRepository } from '../../../../data/protocols/db/logging/logging-error-repository'
import { type Logger } from 'winston'

import loggerFactory from '../../../../main/factories/logger/logger-factory'

export class LoggingWinstonRepository implements LoggingRepository {
  constructor (private readonly logger: Logger = loggerFactory('LoggingWinstonRepository')) {}

  async logError (stack: string): Promise<void> {
    this.logger.error(stack)
  }
}
