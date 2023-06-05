import { SignUpControlller } from '@src/presentation/controllers/user/signup/signup-controller'
import { DbAddAcccount } from '@src/data/usecases/add-account/db-add-account'
import { DbAddUnverifiedAcccount } from '@src/data/usecases/add-unverified-account/db-add-unverified-account-usecase'
import { BcryptAdapter } from '@src/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@src/infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@src/infra/db/mongodb/account/account-mongo-repository'
import { UnverifiedAccountMongoRepository } from '@src/infra/db/mongodb/unverified-account/unverified-account-mongo-repository'
import { type Controller } from '@src/presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { SALT_ROUNDS, JWT_SECRET } from '@src/settings'
import { makeEmailService } from './signup-email-service-factory'

export function makeSignUpController (): Controller {
  const bcryptAdapter = new BcryptAdapter(SALT_ROUNDS)
  const addAccountMongoRepository = new AccountMongoRepository()
  const dbAddAcccount = new DbAddAcccount(bcryptAdapter, addAccountMongoRepository)

  const encrypter = new JwtAdapter(JWT_SECRET)
  const addUnverifiedAccountRepository = new UnverifiedAccountMongoRepository()
  const dbAddUnverifiedAcccount = new DbAddUnverifiedAcccount(encrypter, addUnverifiedAccountRepository)

  const validationComposite = makeSignUpValidation()
  const emailService = makeEmailService()

  return new SignUpControlller(validationComposite, dbAddAcccount, dbAddUnverifiedAcccount, emailService)
}
