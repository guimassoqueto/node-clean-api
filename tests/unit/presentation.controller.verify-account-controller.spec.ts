import { AccountVerification } from "../../src/domain/usecases/account-verification"
import { AccountVerificationError } from "../../src/presentation/controllers/verify-account/verify-account-protocols"
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
  test('Should return 400 if accToken param isnt provided', async () => {
    const { sut, validationStub } = makeSut()
    const error = new Error("any error")
    jest.spyOn(validationStub, "validate").mockReturnValue(error)
    const request = makeHttpRequest()
    delete request.params.accToken
    const response = await sut.handle(request)

    expect(request.params.accToken).toBeFalsy()
    expect(response.statusCode).toBe(400)
  })

  test('Should return 500 if validation throws', async () => {
    const { sut, validationStub } = makeSut()
    const error = new Error("any error")
    jest.spyOn(validationStub, "validate").mockImplementationOnce(() => {
      throw error
    })
    const response = await sut.handle(makeHttpRequest())

    expect(response.statusCode).toBe(500)
  })

  test('Should call accountVerification.verify with correct values ', async () => {
    const { sut, accountVerificationStub } = makeSut()
    const spyVerify = jest.spyOn(accountVerificationStub, "verify")
    const request = makeHttpRequest()
    await sut.handle(request)

    expect(spyVerify).toHaveBeenCalledWith(request.params.accToken)
  })

  test('Should return 500 if verify throws', async () => {
    const { sut, accountVerificationStub } = makeSut()
    jest.spyOn(accountVerificationStub, "verify").mockImplementationOnce(() => {
      throw new Error("any error")
    })
    const response = await sut.handle(makeHttpRequest())

    expect(response.statusCode).toBe(500)
  })

  test('Should return 404 if the token passed is invalid/expired', async () => {
    const { sut, accountVerificationStub } = makeSut()
    jest.spyOn(accountVerificationStub, "verify").mockResolvedValue(false)
    const response = await sut.handle(makeHttpRequest())

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new AccountVerificationError())
  })

  test('Should return 200 if everything works as expected', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeHttpRequest())

    expect(response.statusCode).toBe(200)
  })
})
