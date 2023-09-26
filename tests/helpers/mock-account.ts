import { faker } from '@faker-js/faker'
import { AccountModel } from '@src/domain/models/account'
import { AddAccountParams } from '@src/domain/usecases/account/add-account'
import { LoadAccountByToken } from '@src/domain/usecases/account/load-account-by-token'


/**
 * Create an AccountModel, verified
 */
export function mockAccountModel(): AccountModel {
  return {
    id: 'any-id',
    name: 'any-name',
    password: 'any-password',
    email: 'any-email@email.com',
    createdAt: new Date()
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

