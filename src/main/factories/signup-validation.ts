import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import {
  RequiredFieldValidation,
  FieldsComparisonValidation,
  EmailValidation
} from '../../presentation/helpers/validators/validations'
import { type Validation } from '../../presentation/controllers/signup/signup-protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export function makeSignUpValidation (): ValidationComposite {
  const validations: Validation[] = []

  // validador de checagem se campos obrigatórios estão preenchidos
  for (const requiredField of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(requiredField))
  }

  // validador de checagem de igualdade entre campos (neste caso password, e passwordConfirmation)
  validations.push(new FieldsComparisonValidation('password', 'passwordConfirmation'))

  // validador de chacagem se o email fornecido na requisição é válido
  const emailValidator = new EmailValidatorAdapter()
  validations.push(new EmailValidation('email', emailValidator))

  return new ValidationComposite(validations)
}
