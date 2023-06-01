import { APP_PORT, APP_URL, MONGO_URL } from '@/settings'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import loggerConfig from '../logger-config'

const logger = loggerConfig('main')

const mongo = MongoHelper.getInstance()

mongo.connect(MONGO_URL)
  .then(async () => {
    const app = (await (import('./config/app'))).default
    app.listen(APP_PORT, () => { logger.info(`server is running at ${APP_URL}`) })
  })
  .catch(error => {
    logger.error(error)
  })
