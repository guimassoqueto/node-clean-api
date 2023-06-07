import { AccountModel } from '@src/domain/models/account'
import { AddAccountParams } from '@src/domain/usecases/account/add-account'


/**
 * Create an AccountModel, verified
 */
export function mockAccountModel(verified: boolean = false): AccountModel {
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
 * Mock AddAccountParams
 */
export function mockAddAccountParams(): AddAccountParams {
  return {
    name: 'any-name',
    email: 'any-email@email.com',
    password: 'any-password'
  }
}

