import { MissingParamError } from "../../../src/errors"
import { RequiredFieldValidation } from "../../../src/validation/validations"


describe('RequiredField Validation' , () => {
  test('Should return MissingParamError if some field is missing', () => {
    const sut = new RequiredFieldValidation("email")
    const result = sut.validate({name: "any_name"}) // nao possui o campo "email", logo deve retornar InvalidParam

    expect(result).toEqual(new MissingParamError("email"))
  })

  test('Should return MissingParamError if the field is provided but is empty', () => {
    const sut = new RequiredFieldValidation("email")
    const result = sut.validate({email: ""})

    expect(result).toEqual(new MissingParamError("email"))
  })

  test('Should return null if the field is provided correctly', () => {
    const sut = new RequiredFieldValidation("name")
    const result = sut.validate({name: "some_name"})

    expect(result).toBe(null)
  })
})
