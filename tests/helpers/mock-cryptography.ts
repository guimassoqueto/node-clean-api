import { Decoder, Decrypter, Encrypter, Hasher } from '@src/data/protocols/cryptography'
import { faker } from '@faker-js/faker';

/**
 * Mock Decoder class
 */
export class DecoderSpy implements Decoder {
  encodedValue: string
  decodedValue = faker.string.sample({min: 8, max: 10})

  async decode(encodedValue: string): Promise<string> {
    this.encodedValue = encodedValue
    return Promise.resolve(this.decodedValue)
  }
}


/**
 * Mock Encrypter class
 */
export class EncrypterSpy implements Encrypter {
  plaintext: string
  encryptedValue = faker.string.uuid()

  async encrypt (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return Promise.resolve(this.encryptedValue)
  }
}


/**
 * Mock Decrypter class
 */
export class DecrypterSpy implements Decrypter {
  encryptedString: string
  decryptedValue = faker.string.sample({min: 8, max: 10})

  async decrypt (encryptedString: string): Promise<string | null> {
    this.encryptedString = encryptedString
    return Promise.resolve(this.decryptedValue)
  }
}

/**
 * Mock Hasher class
 */
export class HasherSpy implements Hasher {
  hashedPlaintext = faker.string.uuid()
  plaintext: string

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return Promise.resolve(this.hashedPlaintext)
  }
}