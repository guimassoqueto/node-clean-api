import { InvalidParamError } from '@src/errors'
import { type Validation } from '@src/validation/validation'
import { type EmailValidator } from '@src/validation/protocols'

/**
 * Verifica se o email passado na requisição é válido
 */
export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | null {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isEmailValid) return new InvalidParamError(this.fieldName)
    return null
  }
}
