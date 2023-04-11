import { MissingParamError } from "../../src/presentation/errors"
import { RequiredFieldValidation } from "../../src/presentation/helpers/validators/validations"


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
})
