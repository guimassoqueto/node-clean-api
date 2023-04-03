import { type EmailValidator } from '../presentation/protocols'
import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  async isValid (email: string): Promise<boolean> {
    try {
      const value = validator.isEmail(email)
      return await new Promise((resolve, reject) => {
        resolve(value)
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
