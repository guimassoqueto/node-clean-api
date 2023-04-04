import bcrypt from "bcrypt";
import { BcryptAdapter } from "../../src/infra/cryptography/bcrypt-adapter"

describe('Bcrypt Adapter' , () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, "hash")

    const valueToHash = "any_string" 
    await sut.encrypt(valueToHash)

    expect(hashSpy).toHaveBeenCalledWith(valueToHash, salt)
  })
})

