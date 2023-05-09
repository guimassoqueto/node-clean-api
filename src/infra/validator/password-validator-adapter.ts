import { type PasswordValidator } from '../../presentation/protocols'
import validator from 'validator'

export class PasswordValidatorAdapter implements PasswordValidator {
  isStrong (password: string): boolean {
    const value = validator.isStrongPassword(password)
    return value
  }
}