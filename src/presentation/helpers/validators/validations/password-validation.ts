import { InvalidParamError } from '../../../errors'
import { type Validation } from '../validation'
import { type PasswordValidator } from '../../../protocols'

/**
 * Verifica se a senha fornecida pelo cliente é forte
 */
export class PasswordValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly passwordValidator: PasswordValidator) {}
  validate (input: any): Error | null {
    const isPasswordStrong = this.passwordValidator.isStrong(input[this.fieldName])
    if (!isPasswordStrong) return new InvalidParamError(this.fieldName)
    return null
  }
}
