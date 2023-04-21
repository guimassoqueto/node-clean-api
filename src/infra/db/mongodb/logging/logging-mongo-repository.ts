import { type LoggingRepository } from '../../../../data/protocols/db/logging/logging-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LoggingMongoRepository implements LoggingRepository {
  async logError (stack: string): Promise<void> {
    const loggingErrorsCollection = await MongoHelper.getCollection('loggingErrors')
    await loggingErrorsCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
