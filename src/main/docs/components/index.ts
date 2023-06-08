import { badRequest } from './errors/bad-request'
import { unauthorized } from './errors/unauthorized'
import { serverError } from './errors/server-error'
import { notFound } from './errors/not-found'
import { forbidden } from './errors/forbidden'
import { noContent } from './errors/no-content'

export const components = {
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden,
  noContent
}
