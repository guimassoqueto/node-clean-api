import { type Middleware } from '@src/presentation/protocols'
import { AuthMiddleware } from '@src/presentation/middlewares/auth-middleware'
import { DbLoadAccountByToken } from '@src/data/usecases/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '@src/infra/cryptography/jwt-adapter/jwt-adapter'
import { JWT_SECRET } from '@src/settings'
import { AccountMongoRepository } from '@src/infra/db/mongodb/account/account-mongo-repository'

export function makeAuthMiddleware (role?: string): Middleware {
  const decrypter = new JwtAdapter(JWT_SECRET)
  const loadAccountByTokenRepository = new AccountMongoRepository()
  const loadAccountByToken = new DbLoadAccountByToken(decrypter, loadAccountByTokenRepository)
  return new AuthMiddleware(loadAccountByToken, role)
}
