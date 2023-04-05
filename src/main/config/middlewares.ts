import { type Express } from 'express'
import {
  bodyParser,
  cors,
  contentType
} from '../middlewares'

export default function setUpMiddlewares (app: Express): void {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
