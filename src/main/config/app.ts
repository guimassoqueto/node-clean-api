import express from 'express'
import middlewares from './middlewares'
import routes from './routes'
import health from './routes-healthcheck'
import swagger from './config-swagger'
import staticFiles from './static-files'

const app = express()

swagger(app)
staticFiles(app)
middlewares(app)
health(app) // rota de saúde da aplicação
routes(app)

export default app
