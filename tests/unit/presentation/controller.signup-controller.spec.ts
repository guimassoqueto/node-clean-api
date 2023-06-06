import { SignUpControlller } from '@src/presentation/controllers/account/signup/signup-controller'
import { AddAccount, AddAccountModel } from '@src/domain/usecases/account/add-account'
import { AddUnverifiedAccount } from '@src/domain/usecases/unverified-account/add-unverified-account'
import { AccountModel } from '@src/domain/models/account'
import {
  HttpRequest,
  Validation,
  EmailService,
  EmailVerificationData,
  EmailVerificationResponse,
} from '@src/presentation/controllers/account/signup/signup-controller-protocols'
import { MissingParamError, ServerError } from '@src/errors'
import { badRequest } from '@src/presentation/helpers/http/http-helper'
import { UnverifiedAccountModel } from '@src/domain/models/unverified-account'


function makeUnverifiedAccount(): UnverifiedAccountModel {
  return {
    id: 'any_id',
    accountToken: 'hashed_account_id',
    createdAt: new Date()
  }
}

function makeFakeAccount(): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password',
    verified: true,
    createdAt: new Date()
  }
}

// Factory que cria um AddAccount
function makeAddAccount(): AddAccount {
  // Mock AddAccountStub
  class AddAccountStub implements AddAccount {
    public async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub();
}

function makeAddUnverifiedAccount(): AddUnverifiedAccount {
  class AddUnverifiedAccountStub implements AddUnverifiedAccount {
    async add(accountId: string): Promise<UnverifiedAccountModel> {
      return new Promise(resolve => resolve(makeUnverifiedAccount()))
    }
  }
  return new AddUnverifiedAccountStub()
}

function makeEmailService(): EmailService {
  class EmailServiceStub implements EmailService {
    async sendAccountVerificationEmail(emailVerificationData: EmailVerificationData): Promise<EmailVerificationResponse> {
      return new Promise(resolve => resolve({ statusCode: 200 }))
    }
  }

  return new EmailServiceStub()
}

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub()
}

type SutTypes =  {
  sut: SignUpControlller,
  addAccountStub: AddAccount,
  validationStub: Validation,
  addUnverifiedAccountStub: AddUnverifiedAccount,
  emailServiceStub: EmailService
}

// Factory que cria um SignUpController
function makeSut(): SutTypes {
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount()
  const addUnverifiedAccountStub = makeAddUnverifiedAccount()
  const emailServiceStub = makeEmailService()

  const sut = new SignUpControlller(
    validationStub,
    addAccountStub,
    addUnverifiedAccountStub,
    emailServiceStub
  );

  return {
    sut,
    addAccountStub,
    validationStub,
    addUnverifiedAccountStub,
    emailServiceStub
  }
}

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }
  }
}

describe('Sign Up Controlller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    });
  })

  test('Should return 500 when AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce((account: AddAccountModel) => {
      return new Promise((_, reject) => reject(new ServerError()))
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 when the request body is valid', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  })

  test('Should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut()
    const error = new MissingParamError('any_field')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(error))
  })

  test('Should call addUnverifiedAccount with correct values', async () => {
    const { sut, addUnverifiedAccountStub } = makeSut()
    const addSpy = jest.spyOn(addUnverifiedAccountStub, 'add')
    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith(makeFakeAccount().id)
  })

  test('Should return 500 if addUnverifiedAccountStub throws', async () => {
    const { sut, addUnverifiedAccountStub } = makeSut()
    const error = new Error('any_error')
    jest.spyOn(addUnverifiedAccountStub, 'add').mockImplementationOnce((accountId: string) => {
      return new Promise((_, reject) => reject(new Error()))
    })
    const response = await sut.handle(makeFakeRequest())

    expect(response.statusCode).toBe(500)
  })

  test('Should call emailService.sendAccountVerificationEmail with correct values', async () => {
    const { sut, emailServiceStub } = makeSut()
    const sendAccountVerificationEmailSpy = jest.spyOn(emailServiceStub, 'sendAccountVerificationEmail')
    const fakeRequest = makeFakeRequest()
    await sut.handle(fakeRequest)
    const { email } = fakeRequest.body

    expect(sendAccountVerificationEmailSpy).toHaveBeenCalledWith({ email, accountToken: makeUnverifiedAccount().accountToken })
  })

  test('Should return 500 if sendAccountVerificationEmail throws', async () => {
    const { sut, emailServiceStub } = makeSut()
    const error = new Error('any_error')
    jest.spyOn(emailServiceStub, 'sendAccountVerificationEmail').mockImplementationOnce(() => {
      return new Promise((_, reject) => reject(new Error('sendAccountVerificationEmail error')))
    })
    const response = await sut.handle(makeFakeRequest())

    expect(response.statusCode).toBe(500)
  })
})
