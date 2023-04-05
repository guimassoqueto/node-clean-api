import { type Express } from 'express'
import { bodyParser } from '../middlewares/body-parser'

export default function setUpMiddlewares (app: Express): void {
  app.use(bodyParser)
}
