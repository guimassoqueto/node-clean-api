import { APP_PORT, MONGO_URL } from '../settings'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'

MongoHelper.connect(MONGO_URL)
  .then(async () => {
    const app = (await (import('./config/app'))).default
    app.listen(APP_PORT, () => { console.log(`server is running at ${APP_PORT}`) })
  })
  .catch(error => {
    console.error(error)
  })
