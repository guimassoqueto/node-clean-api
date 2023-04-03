import { type EmailValidator } from '../presentation/protocols'
import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  async isValid (email: string): Promise<boolean> {
    const value = validator.isEmail(email)
    return await new Promise(resolve => { resolve(value) })
  }
}
