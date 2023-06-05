import { type Controller } from '@src/presentation/protocols'
import { LoginController } from '@src/presentation/controllers/account/login/login-controller'
import { DbAuthentication } from '@src/data/usecases/account/authentication/db-authentication'
import { makeLoginValidation } from './login-validation-factory'
import { AccountMongoRepository } from '@src/infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '@src/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@src/infra/cryptography/jwt-adapter/jwt-adapter'
import { JWT_SECRET, SALT_ROUNDS } from '@src/settings'

export function makeLoginController (): Controller {
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(SALT_ROUNDS)
  const encrypter = new JwtAdapter(JWT_SECRET)
  const uptadeAccessTokenRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(loadAccountByEmailRepository, hashComparer, encrypter, uptadeAccessTokenRepository)

  const validationComposite = makeLoginValidation()

  return new LoginController(dbAuthentication, validationComposite)
}
