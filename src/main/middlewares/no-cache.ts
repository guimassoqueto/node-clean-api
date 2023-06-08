/**
 * Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
 * Pragma: no-cache
 * Expires: 0
 * Surrogate-Control: no-store
 * Expires: 0
 */

import { type Request, type Response, type NextFunction } from 'express'

export function noCache (req: Request, res: Response, next: NextFunction): void {
  res.setHeader('cache-control', 'no-cache, no-store, must-revalidate, proxy-revalidate')
  res.setHeader('expires', '0')
  res.setHeader('surrogate-control', 'no-store')
  next()
}
