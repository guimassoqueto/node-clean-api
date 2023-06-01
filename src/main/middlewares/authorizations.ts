import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { expressMiddlewareAdapter } from '../adapters/express-middleware-adapter'

export const authorization = expressMiddlewareAdapter(makeAuthMiddleware())
export const adminAuthorization = expressMiddlewareAdapter(makeAuthMiddleware('ADMIN'))
