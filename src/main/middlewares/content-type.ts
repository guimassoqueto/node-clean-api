import { type Request, type Response, type NextFunction } from 'express'

export function contentType (req: Request, res: Response, next: NextFunction): void {
  res.type('json')
  next()
}
