import bcrypt from "bcrypt";
import { BcryptAdapter } from "../../src/infra/cryptography/bcrypt-adapter"

// Mockando o método hash do bcrypt para retornar um valor esperado
const expectedHash = "any_hash"
jest.mock('bcrypt', () => ({
  async hash(value?: string): Promise<string> {
    return new Promise(resolve => resolve(expectedHash))
  },

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))

// usada para facilitar os tests quando utilizamos o método hash em bcrypt
const BCRYPT_SALT = 12;

// Factory para a criação de BcryptAdapter
function makeSut(): BcryptAdapter {
  return new BcryptAdapter(BCRYPT_SALT);
}

describe('Bcrypt Adapter' , () => {
  test('Should call bcrypt.hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, "hash")
    const valueToHash = "any_string" 
    await sut.hash(valueToHash)

    expect(hashSpy).toHaveBeenCalledWith(valueToHash, BCRYPT_SALT)
  })

  test('Should returns a valid hash on hashing success', async () => {
    const sut = makeSut()
    const hashedValue = await sut.hash("any_string")

    expect(hashedValue).toBe(expectedHash)
  })

  test('Should throw if encrypt gets an error', async () => {
    const sut = makeSut()
    jest.spyOn(sut, "hash").mockReturnValueOnce(new Promise((_, reject) => reject(new Error())))

    const promise = sut.hash("any_string")

    await expect(promise).rejects.toThrow()
  })

  test('Should throw if bcrypt.hash throws', async () => {
    const sut = makeSut()
    const stringToHash = "any_string"
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce((data: string | Buffer, saltOrRounds: string | number) => {
      throw new Error()
    })
    const promise = sut.hash(stringToHash)

    await expect(promise).rejects.toThrow()
  })

  test('Should call bcrypt.compare with correct values', async () => {
    const sut = makeSut()
    const stringToHash = "any_string"
    const bcrypCompareSpy = jest.spyOn(bcrypt, "compare")
    await sut.compare(stringToHash, expectedHash)

    expect(bcrypCompareSpy).toBeCalledWith(stringToHash, expectedHash)
  })

  test('Should return true if compare succeeds', async () => {
    const sut = makeSut()
    const stringToHash = "any_string"
    const result = await sut.compare(stringToHash, expectedHash)

    expect(result).toBe(true)
  })

  test('Should return true if compare succeeds', async () => {
    const sut = makeSut()
    const stringToHash = "any_string"
    const result = await sut.compare(stringToHash, expectedHash)

    expect(result).toBe(true)
  })
})

