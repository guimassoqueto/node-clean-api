import { makeVerifyAccountValidation } from './verify-account-validation-factory'
import { VerifyAccountController } from '@src/presentation/controllers/user/verify-account/verify-accout-controller'
import { type Controller } from '@src/presentation/protocols'
import { DbAccountVerification } from '@src/data/usecases/account-verification/db-account-verification-usecase'
import { JwtAdapter } from '@src/infra/cryptography/jwt-adapter/jwt-adapter'
import { JWT_SECRET } from '@src/settings'
import { AccountMongoRepository } from '@src/infra/db/mongodb/account/account-mongo-repository'
import { UnverifiedAccountMongoRepository } from '@src/infra/db/mongodb/unverified-account/unverified-account-mongo-repository'

export function makeVerifyAccountController (): Controller {
  const validation = makeVerifyAccountValidation()

  const decoder = new JwtAdapter(JWT_SECRET)
  const encrypter = new JwtAdapter(JWT_SECRET)
  const loadAccountByIdRepository = new AccountMongoRepository()
  const updateAccountVerifiedRepository = new AccountMongoRepository()
  const changeAccountIdRepository = new AccountMongoRepository()
  const updateAccessTokenRepository = new AccountMongoRepository()
  const deleteUnverifiedAccountByAccountToken = new UnverifiedAccountMongoRepository()
  const dbAccountVerification = new DbAccountVerification(decoder, encrypter, loadAccountByIdRepository, updateAccountVerifiedRepository, changeAccountIdRepository, updateAccessTokenRepository, deleteUnverifiedAccountByAccountToken)

  return new VerifyAccountController(validation, dbAccountVerification)
}
