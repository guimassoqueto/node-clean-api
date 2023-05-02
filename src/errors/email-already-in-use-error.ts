export class EmailAlreadyInUseError extends Error {
  constructor () {
    super('Email already registered')
    this.name = 'EmailAlreadyRegistered'
  }
}
