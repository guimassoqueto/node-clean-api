import { makeVerifyAccountValidation } from './verify-account-validation-factory'
import { VerifyAccountController } from '../../../presentation/controllers/verify-account/verify-accout-controller'
import { type Controller } from '../../../presentation/protocols'
import { DbAccountVerification } from '../../../data/usecases/account-verification/db-account-verification-usecase'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { JWT_SECRET } from '../../../settings'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { UnverifiedAccountMongoRepository } from '../../../infra/db/mongodb/unverified-account/unverified-account-mongo-repository'

export function makeVerifyAccountController (): Controller {
  const validation = makeVerifyAccountValidation()

  const decrypter = new JwtAdapter(JWT_SECRET)
  const loadAccountByIdRepository = new AccountMongoRepository()
  const updateAccountVerifiedRepository = new AccountMongoRepository()
  const deleteUnverifiedAccountByAccountToken = new UnverifiedAccountMongoRepository()
  const dbAccountVerification = new DbAccountVerification(decrypter, loadAccountByIdRepository, updateAccountVerifiedRepository, deleteUnverifiedAccountByAccountToken)

  return new VerifyAccountController(validation, dbAccountVerification)
}
