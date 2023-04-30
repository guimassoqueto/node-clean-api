import { type Encrypter, type Decrypter } from '../../../data/protocols/cryptography'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly jwtSecret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.jwtSecret)
    return await new Promise(resolve => { resolve(accessToken) })
  }

  async decrypt (encryptedValue: string): Promise<object> {
    const decriptedToken = jwt.decode(encryptedValue)
    return await new Promise(resolve => { resolve(decriptedToken as object) })
  }
}
