import { InvalidParamError } from '../../../errors'
import { type Validation } from '../validation'
import { type EmailValidator } from '../../../protocols'

/**
 * Faz uma comparação entre os campos da requisição, retornando erro se forem diferentes
 */
export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}
  validate (input: any): Error | null {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isEmailValid) return new InvalidParamError(this.fieldName)
    return null
  }
}
