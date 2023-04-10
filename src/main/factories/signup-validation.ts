import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { type Validation } from '../../presentation/controllers/signup/signup-protocols'

export function makeSignUpValidation (): ValidationComposite {
  const validations: Validation[] = []
  for (const requiredField of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(requiredField))
  }
  return new ValidationComposite(validations)
}
