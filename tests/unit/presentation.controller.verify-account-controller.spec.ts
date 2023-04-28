import { AccountVerification } from "../../src/domain/usecases/account-verification"
import { VerifyAccountController } from "../../src/presentation/controllers/verify-account/verify-accout-controller"
import { HttpRequest, Validation } from "../../src/presentation/protocols"

function makeHttpRequest(): HttpRequest {
  return {
    params: {
      accToken: "any-account-token"
    },
    body: {}
  }
}

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

function makeAccountVerification(): AccountVerification {
  class AccountVerificationStub implements AccountVerification {
    async verify (accToken: string): Promise<boolean> {
      return new Promise ( resolve => resolve(true))
    }
  }
  return new AccountVerificationStub()
}

type SutTypes = {
  sut: VerifyAccountController,
  validationStub: Validation,
  accountVerificationStub: AccountVerification
}

function makeSut(): SutTypes {
  const validationStub = makeValidation()
  const accountVerificationStub = makeAccountVerification()
  const sut = new VerifyAccountController(validationStub, accountVerificationStub)

  return {
    sut,
    validationStub,
    accountVerificationStub
  }
}

describe('VerifyAccountController' , () => {
})
