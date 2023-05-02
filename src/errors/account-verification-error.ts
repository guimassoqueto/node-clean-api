export class AccountVerificationError extends Error {
  constructor () {
    super('Cannot verify the provided user')
    this.name = 'AccountVerificationError'
  }
}
