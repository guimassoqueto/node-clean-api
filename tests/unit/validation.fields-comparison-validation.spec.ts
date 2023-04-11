import { InvalidParamError } from "../../src/presentation/errors"
import { FieldsComparisonValidation } from "../../src/presentation/helpers/validators/validations"

describe('Fields Comparison Validator' , () => {
  test('Should return InvalidParamError if the provided fields are different', () => {
    const sut = new FieldsComparisonValidation("password", "passwordConfirmation")
    const result = sut.validate({password: "field", passwordConfirmation: "field_diff"})

    expect(result).toEqual(new InvalidParamError("passwordConfirmation"))
  })

})
