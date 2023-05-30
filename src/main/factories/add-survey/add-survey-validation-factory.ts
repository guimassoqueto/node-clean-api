import { ValidationComposite } from '../../../validation/validation-composite'
import { RequiredFieldValidation } from '../../../validation/validations'
import { type Validation } from '../../../presentation/controllers/user/login/login-controller-protocols'

export function makeAddSurveyValidation (): ValidationComposite {
  const validations: Validation[] = []

  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
