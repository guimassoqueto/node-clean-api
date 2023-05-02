import { ValidationComposite } from '../../../presentation/helpers/validation/validation-composite'
import {
  RequiredFieldValidation,
  EmailValidation
} from '../../../presentation/helpers/validation/validations'
import { type Validation } from '../../../presentation/controllers/login/login-controller-protocols'
import { EmailValidatorAdapter } from '../../adapters/validator/email-validator-adapter'

export function makeLoginValidation (): ValidationComposite {
  const validations: Validation[] = []

  // validador de checagem se campos obrigatórios estão preenchidos
  for (const requiredField of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(requiredField))
  }

  // validador de chacagem se o email fornecido na requisição é válido
  const emailValidator = new EmailValidatorAdapter()
  validations.push(new EmailValidation('email', emailValidator))

  return new ValidationComposite(validations)
}
