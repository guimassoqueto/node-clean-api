import { type Encrypter, type Decrypter, type Decoder } from '@src/data/protocols/cryptography'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter, Decoder {
  constructor (private readonly jwtSecret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign(value, this.jwtSecret)
    return await new Promise(resolve => { resolve(accessToken) })
  }

  async decrypt (encryptedValue: string): Promise<string> {
    const decryptedToken = jwt.verify(encryptedValue, this.jwtSecret)
    return await new Promise(resolve => { resolve(decryptedToken as string) })
  }

  async decode (encodedValue: string): Promise<string> {
    const decodedToken = jwt.decode(encodedValue)
    return await new Promise(resolve => { resolve(decodedToken as string) })
  }
}
