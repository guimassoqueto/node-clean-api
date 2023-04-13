import { type HashComparer, type Hasher } from '../../../data/protocols/cryptography'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    const encryptedValue = await bcrypt.hash(value, this.salt)
    return encryptedValue
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(value, hash)
    return isMatch
  }
}
