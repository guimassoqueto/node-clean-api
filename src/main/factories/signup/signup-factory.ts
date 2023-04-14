import { SignUpControlller } from '../../../presentation/controllers/signup/signup-controller'
import { DbAddAcccount } from '../../../data/usecases/add-account/db-add-account-usecase'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { type Controller } from '../../../presentation/protocols'
import { LoggingControllerDecorator } from '../../decorators/logging-controller-decorator'
import { LoggingMongoRepository } from '../../../infra/db/mongodb/logging/logging-mongo-repository'
import { makeSignUpValidation } from './signup-validation-factory'

export function makeSignUpController (): Controller {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccountMongoRepository = new AccountMongoRepository()
  const dbAddAcccount = new DbAddAcccount(bcryptAdapter, addAccountMongoRepository)

  const validationComposite = makeSignUpValidation()
  const signUpControlller = new SignUpControlller(dbAddAcccount, validationComposite)
  const loggingMongoRepository = new LoggingMongoRepository()

  return new LoggingControllerDecorator(signUpControlller, loggingMongoRepository)
}
