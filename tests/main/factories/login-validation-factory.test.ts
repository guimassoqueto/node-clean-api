import { makeLoginValidation } from '@src/main/factories/controllers/account/login/login-validation-factory'
import { ValidationComposite } from '@src/validation/validation-composite'
import { EmailValidation, RequiredFieldValidation } from '@src/validation/field-validations'
import { Validation } from '@src/validation/validation'
import { mockEmailValidator } from '@tests/helpers'


jest.mock('@src/validation/validation-composite')


describe('LoginValidation Factory' , () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const requiredField of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(requiredField))
    }
    validations.push(new EmailValidation('email', mockEmailValidator()))
    
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
