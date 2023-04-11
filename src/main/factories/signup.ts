import { SignUpControlller } from '../../presentation/controllers/signup/signup-controller'
import { PasswordValidatorAdapter } from '../../utils/password-validator-adapter'
import { DbAddAcccount } from '../../data/usecases/add-account/db-add-account-usecase'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AddAccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { type Controller } from '../../presentation/protocols'
import { LoggingControllerDecorator } from '../decorators/logging'
import { LoggingMongoRepository } from '../../infra/db/mongodb/logging-repository/logging'
import { makeSignUpValidation } from './signup-validation'

export function makeSignUpController (): Controller {
  const passwordValidatorAdapter = new PasswordValidatorAdapter()

  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccountMongoRepository = new AddAccountMongoRepository()
  const dbAddAcccount = new DbAddAcccount(bcryptAdapter, addAccountMongoRepository)

  const validationComposite = makeSignUpValidation()
  const signUpControlller = new SignUpControlller(passwordValidatorAdapter, dbAddAcccount, validationComposite)
  const loggingMongoRepository = new LoggingMongoRepository()

  return new LoggingControllerDecorator(signUpControlller, loggingMongoRepository)
}
