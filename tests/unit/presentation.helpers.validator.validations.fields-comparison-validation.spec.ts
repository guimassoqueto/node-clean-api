import { InvalidParamError } from "../../src/errors"
import { FieldsComparisonValidation } from "../../src/validation/validations"

describe('Fields Comparison Validator' , () => {
  test('Should return InvalidParamError if the provided fields are different', () => {
    const sut = new FieldsComparisonValidation("password", "passwordConfirmation")
    const result = sut.validate({password: "field", passwordConfirmation: "field_diff"})

    expect(result).toEqual(new InvalidParamError("passwordConfirmation"))
  })

  test('Should return InvalidParamError if the provided fields are different case', () => {
    const sut = new FieldsComparisonValidation("password", "passwordConfirmation")
    const result = sut.validate({password: "FIELD", passwordConfirmation: "field"})

    expect(result).toEqual(new InvalidParamError("passwordConfirmation"))
  })

  test('Should return null if the provided fields are equal', () => {
    const sut = new FieldsComparisonValidation("password", "passwordConfirmation")
    const result = sut.validate({password: "field", passwordConfirmation: "field"})

    expect(result).toBeFalsy()
  })
})
