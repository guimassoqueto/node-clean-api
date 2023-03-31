import { ServerError } from '../errors'
import { type IHttpResponse } from '../protocols'

export function badRequest (error: Error): IHttpResponse {
  return {
    statusCode: 400,
    body: error
  }
}

export function serverError (): IHttpResponse {
  return {
    statusCode: 500,
    body: new ServerError()
  }
}
