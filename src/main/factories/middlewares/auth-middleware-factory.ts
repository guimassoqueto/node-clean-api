import { type Middleware } from '../../../presentation/protocols'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { DbLoadAccountByToken } from '../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { JWT_SECRET } from '../../../settings'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'

export function makeAuthMiddleware (role?: string): Middleware {
  const decrypter = new JwtAdapter(JWT_SECRET)
  const loadAccountByTokenRepository = new AccountMongoRepository()
  const loadAccountByToken = new DbLoadAccountByToken(decrypter, loadAccountByTokenRepository)
  return new AuthMiddleware(loadAccountByToken, role)
}
