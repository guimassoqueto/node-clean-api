import { type Controller } from '../../../../presentation/protocols'
import { LoginController } from '../../../../presentation/controllers/user/login/login-controller'
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication-usecase'
import { makeLoginValidation } from './login-validation-factory'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { JWT_SECRET, SALT_ROUNDS } from '../../../../settings'

export function makeLoginController (): Controller {
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(SALT_ROUNDS)
  const encrypter = new JwtAdapter(JWT_SECRET)
  const uptadeAccessTokenRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(loadAccountByEmailRepository, hashComparer, encrypter, uptadeAccessTokenRepository)

  const validationComposite = makeLoginValidation()

  return new LoginController(dbAuthentication, validationComposite)
}
