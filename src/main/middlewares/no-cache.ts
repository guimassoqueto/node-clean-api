/**
 * Cache-Control: no-cache, no-store, must-revalidate
 * Expires: 0
 */

import { type Request, type Response, type NextFunction } from 'express'

export function noCache (req: Request, res: Response, next: NextFunction): void {
  res.setHeader('cache-control', 'no-cache, no-store, must-revalidate')
  res.setHeader('expires', '0')
  next()
}
