import { type Controller, type HttpResponse } from '@src/presentation/protocols'
import { type Request, type Response } from 'express'

// Design Pattern: Adapter
export function expressRouteAdapter (controller: Controller) {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.query || {}),
      ...(req.body || {}),
      ...(req.params || {}),
      accountId: req.accountId
    }
    const response: HttpResponse = await controller.handle(request)

    if (response.statusCode >= 200 && response.statusCode < 400) res.status(response.statusCode).json(response.body)
    else {
      res.status(response.statusCode).json({
        error: response.body.message
      })
    }
  }
}
