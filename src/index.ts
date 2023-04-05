import { app } from './main/server'
import { APP_PORT } from './settings'

app.listen(APP_PORT, () => { console.log(`server is listening to ${APP_PORT}`) })
