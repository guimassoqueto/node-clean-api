import { InvalidParamError } from '@src/errors'
import { type Validation } from '@src/validation/validation'
import { type PasswordValidator } from '@src/validation/protocols'

/**
 * Verifica se a senha fornecida pelo cliente é forte
 */
export class PasswordValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly passwordValidator: PasswordValidator
  ) {}

  validate (input: any): Error | null {
    const isPasswordStrong = this.passwordValidator.isStrong(input[this.fieldName])
    if (!isPasswordStrong) return new InvalidParamError(this.fieldName)
    return null
  }
}
