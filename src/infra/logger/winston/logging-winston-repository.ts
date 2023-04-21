import { type LoggingRepository } from '../../../data/protocols/db/logging/logging-error-repository'
import { type Logger } from 'winston'

import loggerConfig from '../../../logger-config'

export class LoggingWinstonRepository implements LoggingRepository {
  constructor (private readonly logger: Logger = loggerConfig('LoggingWinstonRepository')) { }

  async logError (stack: string): Promise<void> {
    this.logger.error(stack)
  }
}
