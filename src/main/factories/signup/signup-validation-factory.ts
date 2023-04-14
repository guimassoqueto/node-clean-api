import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import {
  RequiredFieldValidation,
  FieldsComparisonValidation,
  EmailValidation,
  PasswordValidation
} from '../../../presentation/helpers/validators/validations'
import { type Validation } from '../../../presentation/controllers/signup/signup-controller-protocols'
import { EmailValidatorAdapter } from '../../adapters/validator/email-validator-adapter'
import { PasswordValidatorAdapter } from '../../adapters/validator/password-validator-adapter'

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

  // validador de checagem de força de senha
  const passwordValidator = new PasswordValidatorAdapter()
  validations.push(new PasswordValidation('password', passwordValidator))

  return new ValidationComposite(validations)
}

/*
  const passwordValidatorAdapter = new PasswordValidatorAdapter()
*/
