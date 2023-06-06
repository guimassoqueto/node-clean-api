import { ValidationComposite } from '@src/validation/validation-composite'
import { type Validation } from '@src/validation/validation'
import {
  RequiredFieldValidation,
  EmailValidation
} from '@src/validation/field-validations'
import { EmailValidatorAdapter } from '@src/infra/validator/email-validator-adapter'

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
