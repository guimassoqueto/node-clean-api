import { makeSignUpValidation } from '@src/main/factories/controllers/account/signup/signup-validation-factory'
import { ValidationComposite } from '@src/validation/validation-composite'
import { 
  RequiredFieldValidation, 
  FieldsComparisonValidation,
  EmailValidation,
  PasswordValidation
} from '@src/validation/field-validations'
import { Validation } from '@src/validation/validation'
import { mockEmailValidator, mockPasswordValidator } from '@tests/helpers'

jest.mock('@src/validation/validation-composite')


describe('makeSignUpValidation' , () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const requiredField of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(requiredField))
    }
    validations.push(new FieldsComparisonValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', mockEmailValidator()))
    validations.push(new PasswordValidation('password', mockPasswordValidator()))
    
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
