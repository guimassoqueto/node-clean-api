import { type Express } from 'express'
import { bodyParser } from '../middlewares/body-parser'
import { cors } from '../middlewares/cors'

export default function setUpMiddlewares (app: Express): void {
  app.use(bodyParser)
  app.use(cors)
}
