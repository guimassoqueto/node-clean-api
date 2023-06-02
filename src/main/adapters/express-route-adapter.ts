import { type Controller, type HttpRequest, type HttpResponse } from '@src/presentation/protocols'
import { type Request, type Response } from 'express'

// Design Pattern: Proxy
export function expressRouteAdapter (controller: Controller) {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      query: req.query,
      body: req.body
    }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 400) res.status(httpResponse.statusCode).json(httpResponse.body)
    else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
