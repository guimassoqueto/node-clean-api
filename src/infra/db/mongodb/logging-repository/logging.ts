import { type LoggingErrorRepository } from '../../../../data/protocols/logging-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LoggingMongoRepository implements LoggingErrorRepository {
  async logError (stack: string): Promise<void> {
    const loggingErrorsCollection = await MongoHelper.getCollection('loggingErrors')
    await loggingErrorsCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}