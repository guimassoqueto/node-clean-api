import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { expressMiddlewareAdapter } from '../adapters/express-middleware-adapter'

// Qualquer usuario pode acessar a rota
export const anyUserAuthorization = expressMiddlewareAdapter(makeAuthMiddleware())

// Apenas 'ADMIN' podem acessar a rota
export const adminAuthorization = expressMiddlewareAdapter(makeAuthMiddleware('ADMIN'))
