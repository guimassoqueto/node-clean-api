import jwt from 'jsonwebtoken';
import { JwtAdapter } from '@src/infra/cryptography/jwt-adapter/jwt-adapter'
import { JWT_SECRET } from '@tests/settings';

const token = 'any-token'
const verifiedToken = 'decrypted-token'
const decodedToken = 'decoded-token'
jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return token
  },
  verify(): string {
    return verifiedToken
  },
  decode(): string {
    return decodedToken
  }
}))

type SutTypes =  {
  sut: JwtAdapter
}

function makeSut(): SutTypes {
  const sut = new JwtAdapter(JWT_SECRET)

  return {
    sut
  }
}

describe('JwtAdapter' , () => {
  describe('sign()' , () => {
    test('Should call sign with correct values', async () => {
      const { sut } = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      const id = 'any_id'
      
      await sut.encrypt(id)
  
      expect(signSpy).toHaveBeenCalledWith(id, JWT_SECRET)
    })
  
    test('Should returns a token on sign success', async () => {
      const { sut } = makeSut()
      const accessToken = await sut.encrypt('any_id')
  
      expect(accessToken).toBe(token)
    })
  
    test('Should throw if jwt throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce((payload: string | object | Buffer, secretOrPrivateKey: jwt.Secret) => {
        throw new Error()
      })

      const promise = sut.encrypt('any_id')
  
      await expect(promise).rejects.toThrow()
    })
  })

  describe('decode()' , () => {
    test('Should call decode with correct values', async () => {
      const { sut } = makeSut()
      const signSpy = jest.spyOn(jwt, 'decode')
      const encodedToken = 'encoded-token'
      
      await sut.decode(encodedToken)
  
      expect(signSpy).toHaveBeenCalledWith(encodedToken)
    })
  
    test('Should returns a token on decode success', async () => {
      const { sut } = makeSut()
      const accessToken = await sut.decode('encoded-token')
  
      expect(accessToken).toBe(decodedToken)
    })
  
    test('Should throw if jwt throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'decode').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.decode('any_id')
  
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()' , () => {
    test('Should call decode with correct values', async () => {
      const { sut } = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      const value = 'any-value'
      sut.decrypt(value)
  
      expect(verifySpy).toHaveBeenCalledWith(value, JWT_SECRET)
    })

    test('Should returns a value on decrypt success', async () => {
      const { sut } = makeSut()
      const accessToken = await sut.decrypt('any-encrypted-value')
  
      expect(accessToken).toBe(verifiedToken)
    })

    test('Should throw if jwt throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.decrypt('any-encrypted-value')
  
      await expect(promise).rejects.toThrow()
    })
  })
})
