import { SignUpControlller } from '../../../presentation/controllers/signup/signup-controller'
import { DbAddAcccount } from '../../../data/usecases/add-account/db-add-account-usecase'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { type Controller } from '../../../presentation/protocols'
import { LoggingControllerDecorator } from '../../decorators/logging-controller-decorator'
import { LoggingWinstonRepository } from '../../../infra/logger/winston/logging-winston-repository'
import { makeSignUpValidation } from './signup-validation-factory'
import { SALT_ROUNDS } from '../../../settings'

export function makeSignUpController (): Controller {
  const bcryptAdapter = new BcryptAdapter(SALT_ROUNDS)
  const addAccountMongoRepository = new AccountMongoRepository()
  const dbAddAcccount = new DbAddAcccount(bcryptAdapter, addAccountMongoRepository)

  const validationComposite = makeSignUpValidation()
  const signUpControlller = new SignUpControlller(dbAddAcccount, validationComposite)
  const loggingWinstonRepository = new LoggingWinstonRepository()

  return new LoggingControllerDecorator(signUpControlller, loggingWinstonRepository)
}
