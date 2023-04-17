import express from 'express'
import setUpMiddlewares from './middlewares'
import setUpRoutes from './routes'
import healthcheckRoute from './healthcheckRoute'

const app = express()
setUpMiddlewares(app)
healthcheckRoute(app) // rota de saúde da aplicação
setUpRoutes(app)

export default app
