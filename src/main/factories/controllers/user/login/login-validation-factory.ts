import { ValidationComposite } from '../../../../../validation/validation-composite'
import {
  RequiredFieldValidation,
  EmailValidation
} from '../../../../../validation/validations'
import { type Validation } from '@src/presentation/controllers/user/login/login-controller-protocols'
import { EmailValidatorAdapter } from '../../../../../infra/validator/email-validator-adapter'

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
