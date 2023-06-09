import { ValidationComposite } from '@src/validation/validation-composite'
import {
  RequiredFieldValidation
} from '@src/validation/field-validations'
import { type Validation } from '@src/validation/validation'

export function makeVerifyAccountValidation (): ValidationComposite {
  const validations: Validation[] = []

  // validador de checagem se campos obrigatórios estão preenchidos
  for (const requiredField of ['accountToken']) {
    validations.push(new RequiredFieldValidation(requiredField))
  }

  return new ValidationComposite(validations)
}
