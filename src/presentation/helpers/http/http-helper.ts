import { ServerError, AuthorizationError } from '../../../errors'
import { type HttpResponse } from '../../protocols'

export function badRequest (error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: error
  }
}

export function notFound (error?: Error): HttpResponse {
  return {
    statusCode: 404,
    body: error
  }
}

export function forbidden (error: Error): HttpResponse {
  return {
    statusCode: 403,
    body: error
  }
}

export function serverError (error: Error): HttpResponse {
  return {
    statusCode: 500,
    body: new ServerError(error.stack)
  }
}

export function noContent (): HttpResponse {
  return {
    statusCode: 204,
    body: null
  }
}

export function unauthorized (): HttpResponse {
  return {
    statusCode: 401,
    body: new AuthorizationError()
  }
}

export function ok (data: any): HttpResponse {
  return {
    statusCode: 200,
    body: data
  }
}

export function conflict (error: Error): HttpResponse {
  return {
    statusCode: 409,
    body: error
  }
}
