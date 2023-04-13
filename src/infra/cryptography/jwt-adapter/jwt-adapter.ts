import { type Encrypter } from '../../../data/protocols/cryptography'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  constructor (private readonly jwtSecret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.jwtSecret)
    return await new Promise(resolve => { resolve(accessToken) })
  }
}
