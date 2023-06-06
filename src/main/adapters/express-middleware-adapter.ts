import { type Middleware, type HttpRequest, type HttpResponse } from '@src/presentation/protocols'
import { type Request, type Response, type NextFunction } from 'express'

// Design Pattern: Proxy
export function expressMiddlewareAdapter (middleware: Middleware) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
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
