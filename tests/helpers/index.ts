//domain mocks
import { SurveyModel } from '@src/domain/models/survey'
import { AccountModel } from '@src/domain/models/account'
import { LoadSurveys } from '@src/domain/usecases/survey/load-surveys'
import { AddAccountParams } from '@src/domain/usecases/account/add-account'
import { UnverifiedAccountModel } from '@src/domain/models/unverified-account'
import { AddSurvey, AddSurveyParams } from '@src/domain/usecases/survey/add-survey'
import { SaveSurveyResultParams } from '@src/domain/usecases/survey-result/save-survey-result'
import { Authentication, AuthenticationParams } from '@src/domain/usecases/account/authentication'

// data mocks
import { AddAccountRepository } from '@src/data/protocols/db/account'
import { Decoder, Decrypter, Encrypter, Hasher } from '@src/data/protocols/cryptography'
import { AddSurveyRepository, LoadSurveysRepository } from '@src/data/protocols/db/survey'

// validation mocks
import { EmailValidator, PasswordValidator } from '@src/validation/protocols'
import { Validation } from '@src/validation/validation'



interface AccountModelWithToken extends Omit<AccountModel, 'id'> {
  accessToken: string; 
}


/**
 * Create an AccountModel, verified
 */
export function mockAccount(verified: boolean = false): AccountModel {
  return {
    id: 'any-id',
    name: 'any-name',
    password: 'any-password',
    email: 'any-email@email.com',
    verified,
    createdAt: new Date()
  }
}

/**
 * Create an Account with AccessToken
 */
export function mockAccountWithToken(verified: boolean = false): AccountModelWithToken {
  return {
    name: 'any-name',
    email: 'any-email@email.com',
    password: 'any-password',
    verified,
    createdAt: new Date(2030, 11, 31),
    accessToken: 'any-token',
  }
}


/**
 * Create an Account without AccessToken
 */
export function mockAddAccount(verified: boolean = false): Omit<AccountModel, 'id'> {
  return {
    name: 'any-name',
    email: 'any-email@email.com',
    password: 'any-password',
    verified,
    createdAt: new Date(2030, 11, 31)
  }
}


/**
 * Mock Date whenever the class Date is called
 * (global as any).Date = MockDate; // before all calls
 * (global as any).Date = RealDate; // after all calls, to calls run normally
 */
export const RealDate = Date;
export class MockDate extends RealDate {
  constructor() {
    super('2030-11-31T00:00:00Z');
  }
}


/**
 * Create a Survey
 */
export function mockSurvey(): SurveyModel {
  return {
    id: 'any-id',
    question: 'any-question',
    answers: [
      {
        image:'any-image',
        answer: 'any-answer-1'
      },
      {
        answer: 'any-answer-2'
      },
    ],
    createdAt: new Date(2030, 11, 31)
  }
}


/**
 * Create a list of Surveys
 */
export function mockSurveys(ListSize: number = 2): SurveyModel[] {
  let surveys: SurveyModel[] = [];
  for (let i = 0; i <= ListSize; i++) {
    surveys.push({
      id: 'any-id',
      question: `any-question${i}`,
      answers: [
        {
          image:'any-image',
          answer: 'any-answer-1'
        },
        {
          answer: 'any-answer-2'
        },
      ],
      createdAt: new Date(2030, 11, 31)
    });
  }
  return surveys
}

/**
 * Mock AddSurveyParams
 */
export function mockAddSurveysParams(questionNumber?: number): AddSurveyParams {
  return {
    createdAt: new Date(2030,11, 31),
    question: `any-question${(typeof questionNumber !== 'undefined') ? questionNumber: ''}`,
    answers: [
      {
        image:'any-image',
        answer: 'any-answer-1'
      },
      {
        answer: 'any-answer-2'
      },
    ]
  }
}


/**
 * Mock AddAccountParams
 */
export function mockAddAccountParams(): AddAccountParams {
  return {
    name: 'any-name',
    email: 'any-email@email.com',
    password: 'any-password'
  }
}

/**
 * Mock Decoder class
 */
export function mockDecoder(): Decoder {
  class DecoderStub implements Decoder {
    async decode(encodedValue: string): Promise<string> {
      return new Promise(resolve => resolve('any-decoded-value'))
    }
  }
  return new DecoderStub()
}


/**
 * Mock Encrypter class
 */
export function mockEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt (encryptedValue: string): Promise<string> {
      return new Promise(resolve => resolve('any-token'))
    }
  }
  return new EncrypterStub()
}

/**
 * Mock Decrypter class
 */
export function mockDecrypter(): Decrypter {
  class DecrypterStub implements Decrypter {
    decrypt (encryptedValue: string): Promise<string> {
      return new Promise(resolve => resolve('any-decrypted-value'))
    }
  }
  return new DecrypterStub()
}

/**
 * Mock Hasher class
 */
export function mockHasher(): Hasher {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed-password'));
    }
  }
  return new HasherStub()
}


/**
 * Mock AddAccountRepository class
 */
export function mockAddAccountRepository(): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return new Promise(resolve => resolve(mockAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}


/**
 * Mock AddSurveyRepository class
 */
export function mockAddSurveyRepository(): AddSurveyRepository {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    add (surveyData: AddSurveyParams): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}

/**
 * Mock AuthenticationParams
 */
export function mockAuthenticationParams(): AuthenticationParams {
  return {
    email: 'any-email',
    password: 'any-password'
  }
}


/**
 * Mock LoadSurveysRepository
 */
export function mockLoadSurveyRepository(): LoadSurveysRepository {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(mockSurveys()))
    }
  }
  return new LoadSurveysRepositoryStub()
}

/**
 * Mock SaveSurveyResultParams
 */
export function mockSaveSurveyResultParams(): SaveSurveyResultParams {
  return {
    surveyId: 'any-survey-id',
    accountId: 'any-account-id',
    answer: 'any-answer',
    date: new Date(2030, 11, 31)
  }
}


/**
 * Mock EmailValidator class
 */
export function mockEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string) {
      return true
    }
  }
  return new EmailValidatorStub()
}


/**
 * Mock PasswordValidator class 
 */
export function mockPasswordValidator(): PasswordValidator {
  class PasswordValidatorStub implements PasswordValidator {
    isStrong (password: string) {
      return true
    }
  }
  return new PasswordValidatorStub()
}


/**
 * Mock Validation class
 */
export function mockValidation(): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

/**
 * Mock AddSurvey class
 */
export function mockAddSurvey(): AddSurvey {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyParams): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyStub()
}


/**
 * Mock LoadSurveys class
 */
export function mockLoadSurveys(): LoadSurveys {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(mockSurveys()))
    }
  }
  return new LoadSurveysStub()
}


/**
 * Mock Authentication class
 */
export function mockAuthentication(accessToken: string = 'any-token'): Authentication {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationParams): Promise<string | null> {
      return new Promise(resolve => resolve(accessToken))
    }
  }
  return new AuthenticationStub()
}


/**
 * Create an UnverifiedAccountModel
 */
export function mockUnverifiedAccount(): UnverifiedAccountModel {
  return {
    id: 'any-id',
    accountToken: 'any-token',
    createdAt: new Date()
  }
}
