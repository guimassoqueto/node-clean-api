import { ValidationComposite } from '@src/validation/validation-composite'
import { RequiredFieldValidation } from '@src/validation/validations'
import { type Validation } from '@src/presentation/controllers/user/login/login-controller-protocols'

export function makeAddSurveyValidation (): ValidationComposite {
  const validations: Validation[] = []

  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
