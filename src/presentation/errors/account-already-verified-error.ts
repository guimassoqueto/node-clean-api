export class AccountAlreadyVerifiedError extends Error {
  constructor () {
    super('Account already verified')
    this.name = 'AccountAlreadyVerifiedError'
  }
}
