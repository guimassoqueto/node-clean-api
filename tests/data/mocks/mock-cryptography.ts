import { faker } from '@faker-js/faker'
import { Decoder, Decrypter, Encrypter, Hasher } from '@src/data/protocols/cryptography'

export class HasherSpy implements Hasher {
  hashedPlaintext = faker.string.uuid()
  plaintext: string

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return Promise.resolve(this.hashedPlaintext)
  }
}