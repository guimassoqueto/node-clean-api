import { RequiredFieldValidation } from '@src/validation/field-validations'
import { ValidationComposite } from '@src/validation/validation-composite'
import { type Validation } from '@src/validation/validation'

export function makeAddSurveyValidation (): ValidationComposite {
  const validations: Validation[] = []

  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
