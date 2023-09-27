import {
  type HttpResponse,
  type Middleware
} from '@src/presentation/protocols'
import { type NextFunction, type Request, type Response } from 'express'

// Design Pattern: Proxy
export function expressMiddlewareProxy (middleware: Middleware) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest = {
      accessToken: req.headers?.['x-access-token'],
      ...(req.headers || {})
    }
    const httpResponse: HttpResponse = await middleware.handle(httpRequest)

    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
