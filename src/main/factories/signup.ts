import { SignUpControlller } from '../../presentation/controllers/signup/signup-controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { PasswordValidatorAdapter } from '../../utils/password-validator-adapter'
import { DbAddAcccount } from '../../data/usecases/add-account/db-add-account-usecase'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AddAccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { type Controller } from '../../presentation/protocols'
import { LoggingControllerDecorator } from '../decorators/logging'

export function makeSignUpController (): Controller {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const passwordValidatorAdapter = new PasswordValidatorAdapter()

  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccountMongoRepository = new AddAccountMongoRepository()
  const dbAddAcccount = new DbAddAcccount(bcryptAdapter, addAccountMongoRepository)
  const signUpControlller = new SignUpControlller(emailValidatorAdapter, passwordValidatorAdapter, dbAddAcccount)
  return new LoggingControllerDecorator(signUpControlller)
}
