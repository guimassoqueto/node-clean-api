import { ValidationComposite } from "../../src/presentation/helpers/validators/validation-composite"
import { Validation } from "../../src/presentation/helpers/validators/validation"
import { MissingParamError, InvalidParamError } from "../../src/presentation/errors"

function makeValidation(): Validation {
  class ValidationSut implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationSut()
}

interface sutTypes {
  sut: ValidationComposite,
  validationStubs: Validation[]
}

function makeSut(): sutTypes {
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

    jest.spyOn(ValidationStubOne, "validate").mockImplementationOnce((input: any) => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })

  test('Should return the first error if multiple validations returns', () => {
    const { sut, validationStubs } = makeSut()
    const [ ValidationStubOne, ValidationStubTwo ] = validationStubs
    jest.spyOn(ValidationStubOne, "validate").mockImplementationOnce((input: any) => {
      return new InvalidParamError("field")
    })
    jest.spyOn(ValidationStubTwo, "validate").mockImplementationOnce((input: any) => {
      return new MissingParamError("field")
    })
    const result = sut.validate({ field: "any_value" })

    expect(result).toEqual(new InvalidParamError("field"))
  })
})
