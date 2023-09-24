import { SignUpControlller } from '@src/presentation/controllers/account/signup/signup-controller'
import { DbAddAcccount } from '@src/data/usecases/account/add-account/db-add-account'
import { BcryptAdapter } from '@src/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@src/infra/db/mongodb/account/account-mongo-repository'
import { type Controller } from '@src/presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { SALT_ROUNDS } from '@src/settings'

export function makeSignUpController (): Controller {
  const bcryptAdapter = new BcryptAdapter(SALT_ROUNDS)
  const addAccountMongoRepository = new AccountMongoRepository()
  const dbAddAcccount = new DbAddAcccount(bcryptAdapter, addAccountMongoRepository)
  const validationComposite = makeSignUpValidation()

  return new SignUpControlller(validationComposite, dbAddAcccount)
}
