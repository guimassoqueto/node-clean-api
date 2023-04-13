import bcrypt from "bcrypt";
import { BcryptAdapter } from "../../src/infra/cryptography/bcrypt-adapter"

// Mockando o método hash do bcrypt para retornar um valor esperado
jest.mock('bcrypt', () => ({
  async hash(value?: string): Promise<string> {
    return new Promise(resolve => resolve("xxx111222"))
  }
}))

// usada para facilitar os tests quando utilizamos o método hash em bcrypt
const BCRYPT_SALT = 12;

// Factory para a criação de BcryptAdapter
function makeSut(): BcryptAdapter {
  return new BcryptAdapter(BCRYPT_SALT);
}

describe('Bcrypt Adapter' , () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, "hash")
    const valueToHash = "any_string" 
    await sut.hash(valueToHash)

    expect(hashSpy).toHaveBeenCalledWith(valueToHash, BCRYPT_SALT)
  })

  test('Should returns the hash on encryption success', async () => {
    const sut = makeSut()
    const hashedValue = await sut.hash("any_string")

    expect(hashedValue).toBe("xxx111222")
  })

  test('Should throw if encrypt gets an error', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(sut, "hash").mockReturnValueOnce(new Promise((_, reject) => reject(new Error())))

    const promise = sut.hash("any_string")

    await expect(promise).rejects.toThrow()
  })
})

