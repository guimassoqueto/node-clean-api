import { SignUpControlller } from "@src/presentation/controllers/account/signup/signup-controller"
import { badRequest } from "@src/presentation/helpers/http"
import {
  MissingParamError,
  ServerError,
} from "@src/presentation/controllers/account/signup/signup-controller-protocols"
import {
  MockDate,
  ValidationSpy,
  RealDate,
  AddAccountSpy
} from "@tests/presentation/mocks"
import { faker } from "@faker-js/faker"


type SutTypes = {
  sut: SignUpControlller
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
}

// Factory que cria um SignUpController
function makeSut(): SutTypes {
  const validationSpy = new ValidationSpy()
  const addAccountSpy = new AddAccountSpy()

  const sut = new SignUpControlller(
    validationSpy,
    addAccountSpy   
  )

  return {
    sut,
    addAccountSpy,
    validationSpy  
  }
}

function mockRequest(): SignUpControlller.Request {
  const password = faker.internet.password()
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: password,
    passwordConfirmation: password,
  }
}

describe("SignUpControlller", () => {
  beforeAll(() => {
    (global as any).Date = MockDate
  })
  afterAll(() => {
    (global as any).Date = RealDate
  })

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)

    expect(addAccountSpy.account.name).toEqual(request.name)
    expect(addAccountSpy.account.email).toEqual(request.email)
    expect(addAccountSpy.account.password).toEqual(request.password)
  })

  test("Should return 500 when AddAccount throws", async () => {
    const { sut, addAccountSpy } = makeSut()
    const error = new ServerError()
    jest.spyOn(addAccountSpy, "add").mockRejectedValue(error)
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  test("Should return 200 when the request body is valid", async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(200)
  })

  test("Should call Validation with correct value", async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toBe(request)
  })

  test("Should return 400 if Validation return an error", async () => {
    const { sut, validationSpy } = makeSut()
    const error = new MissingParamError("any_field")
    validationSpy.result = error
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(error))
  })

})
