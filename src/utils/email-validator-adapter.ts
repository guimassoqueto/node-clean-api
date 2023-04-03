import { type EmailValidator } from '../presentation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  async isValid (email: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      if (!email.includes('@')) resolve(false)
      else resolve(true)
    })
  }
}
