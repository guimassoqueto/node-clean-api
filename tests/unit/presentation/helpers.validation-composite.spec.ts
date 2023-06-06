import { ValidationComposite } from '@src/validation/validation-composite'
import { MissingParamError, InvalidParamError } from '@src/errors'
import { Validation } from '@src/validation/validation'

function makeValidation(): Validation {
  class ValidationSut implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationSut()
}

type SutTypes =  {
  sut: ValidationComposite,
  validationStubs: Validation[]
}

function makeSut(): SutTypes {
  const validationStubs = [ makeValidation(), makeValidation() ] 
  const sut = new ValidationComposite( validationStubs )
  return {
    sut,
    validationStubs
  }
}

describe('ValidationComposite' , () => {
  test('Should throws error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    const [ ValidationStubOne, _ ] = validationStubs

    jest.spyOn(ValidationStubOne, 'validate').mockImplementationOnce((input: any) => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })

  test('Should return the first error if multiple validations returns', () => {
    const { sut, validationStubs } = makeSut()
    const [ ValidationStubOne, ValidationStubTwo ] = validationStubs
    jest.spyOn(ValidationStubOne, 'validate').mockImplementationOnce((input: any) => {
      return new InvalidParamError('field')
    })
    jest.spyOn(ValidationStubTwo, 'validate').mockImplementationOnce((input: any) => {
      return new MissingParamError('field')
    })
    const result = sut.validate({ field: 'any_value' })

    expect(result).toEqual(new InvalidParamError('field'))
  })

  test('Should return null if all validations Pass', () => {
    const { sut } = makeSut()
    const result = sut.validate({ field: 'any_data' })
    expect(result).toEqual(null)
  })
})
