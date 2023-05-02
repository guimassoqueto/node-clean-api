import { ValidationComposite } from '../../../presentation/helpers/validation/validation-composite'
import {
  RequiredFieldValidation
} from '../../../presentation/helpers/validation/validations'
import { type Validation } from '../../../presentation/controllers/login/login-controller-protocols'

export function makeVerifyAccountValidation (): ValidationComposite {
  const validations: Validation[] = []

  // validador de checagem se campos obrigatórios estão preenchidos
  for (const requiredField of ['accountToken']) {
    validations.push(new RequiredFieldValidation(requiredField))
  }

  return new ValidationComposite(validations)
}
