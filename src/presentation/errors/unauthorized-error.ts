export class AuthorizationError extends Error {
  constructor () {
    super('Invalid credentials')
    this.name = 'AuthorizationError'
  }
}
