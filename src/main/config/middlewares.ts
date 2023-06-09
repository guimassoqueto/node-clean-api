import { type Express } from 'express'
import {
  bodyParser,
  cors,
  contentType
} from '@src/main/middlewares'

export default function (app: Express): void {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
