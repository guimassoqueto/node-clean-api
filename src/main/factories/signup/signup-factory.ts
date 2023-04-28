import { SignUpControlller } from '../../../presentation/controllers/signup/signup-controller'
import { DbAddAcccount } from '../../../data/usecases/add-account/db-add-account-usecase'
import { DbAddUnverifiedAcccount } from '../../../data/usecases/add-unverified-account/db-add-unverified-account-usecase'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { AccountVerificationMongoRepository } from '../../../infra/db/mongodb/account/unverified-account-mongo-repository'
import { type Controller } from '../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { SALT_ROUNDS, JWT_SECRET } from '../../../settings'
import { makeEmailService } from './signup-email-service-factory'

export function makeSignUpController (): Controller {
  const bcryptAdapter = new BcryptAdapter(SALT_ROUNDS)
  const addAccountMongoRepository = new AccountMongoRepository()
  const dbAddAcccount = new DbAddAcccount(bcryptAdapter, addAccountMongoRepository)

  const encrypter = new JwtAdapter(JWT_SECRET)
  const addUnverifiedAccountRepository = new AccountVerificationMongoRepository()
  const dbAddUnverifiedAcccount = new DbAddUnverifiedAcccount(encrypter, addUnverifiedAccountRepository)

  const validationComposite = makeSignUpValidation()
  const emailService = makeEmailService()

  return new SignUpControlller(validationComposite, dbAddAcccount, dbAddUnverifiedAcccount, emailService)
}
