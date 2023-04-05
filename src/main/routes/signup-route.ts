import { type Router, type Request, type Response } from 'express'

export default function (router: Router): void {
  router.post('/signup', (req: Request, res: Response) => {
    res.json({ ok: 'ok' })
  })
}
