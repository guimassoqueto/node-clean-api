import { UnverifiedAccountModel } from '@src/domain/models/unverified-account'


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