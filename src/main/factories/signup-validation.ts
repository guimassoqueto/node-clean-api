import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import {
  RequiredFieldValidation,
  FieldsComparisonValidation
} from '../../presentation/helpers/validators/validations'
import { type Validation } from '../../presentation/controllers/signup/signup-protocols'

export function makeSignUpValidation (): ValidationComposite {
  const validations: Validation[] = []

  // validador de checagem se campos obrigatórios estão preenchidos
  for (const requiredField of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(requiredField))
  }

  // validador de checagem de igualdade entre campos (neste caso password, e passwordConfirmation)
  validations.push(new FieldsComparisonValidation('password', 'passwordConfirmation'))

  return new ValidationComposite(validations)
}
