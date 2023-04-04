import bcrypt from "bcrypt";
import { BcryptAdapter } from "../../src/infra/cryptography/bcrypt-adapter"

// Mockando o método hash do bcrypt para retornar um valor esperado
jest.mock('bcrypt', () => ({
  async hash(value?: string): Promise<string> {
    return new Promise(resolve => resolve("xxx111222"))
  }
}))

describe('Bcrypt Adapter' , () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, "hash")

    const valueToHash = "any_string" 
    await sut.encrypt(valueToHash)

    expect(hashSpy).toHaveBeenCalledWith(valueToHash, salt)
  })

  test('Should returns the hash on encryption success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const valueToHash = "any_string"
    const hashedValue = await sut.encrypt(valueToHash)

    expect(hashedValue).toBe("xxx111222")
  })
})

