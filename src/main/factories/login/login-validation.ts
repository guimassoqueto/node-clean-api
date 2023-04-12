import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import {
  RequiredFieldValidation,
  EmailValidation
} from '../../../presentation/helpers/validators/validations'
import { type Validation } from '../../../presentation/controllers/login/login-protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

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