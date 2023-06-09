import { InvalidParamError } from '@src/errors'
import { type Validation } from '@src/validation/validation'

/**
 * Faz uma comparação entre os campos da requisição, retornando erro se forem diferentes
 */
export class FieldsComparisonValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldNameToCompare: string
  ) {}

  validate (input: any): Error | null {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) return new InvalidParamError(this.fieldNameToCompare)
    return null
  }
}
