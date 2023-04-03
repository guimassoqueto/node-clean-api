import { type PasswordValidator } from '../presentation/protocols'
import validator from 'validator'

export class PasswordValidatorAdapter implements PasswordValidator {
  async isStrong (password: string): Promise<boolean> {
    const value = validator.isStrongPassword(password)
    return await new Promise(resolve => { resolve(value) })
  }
}
