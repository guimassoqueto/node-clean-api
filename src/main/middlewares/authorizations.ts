import { makeAuthMiddleware } from '@src/main/factories/middlewares/auth-middleware-factory'
import { expressMiddlewareProxy } from '@src/main/adapters/express-middleware-proxy'

// Qualquer usuario pode acessar a rota
export const anyUserAuthorization = expressMiddlewareProxy(
  makeAuthMiddleware()
)

// Apenas 'ADMIN' podem acessar a rota
export const adminAuthorization = expressMiddlewareProxy(
  makeAuthMiddleware('ADMIN')
)
