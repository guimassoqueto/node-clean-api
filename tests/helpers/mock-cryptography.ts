import { Decoder, Decrypter, Encrypter, Hasher } from '@src/data/protocols/cryptography'


/**
 * Mock Decoder class
 */
export function mockDecoder(): Decoder {
  class DecoderStub implements Decoder {
    async decode(encodedValue: string): Promise<string> {
      return Promise.resolve('any-decoded-value')
    }
  }
  return new DecoderStub()
}


/**
 * Mock Encrypter class
 */
export function mockEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt (encryptedValue: string): Promise<string> {
      return Promise.resolve('any-token')
    }
  }
  return new EncrypterStub()
}

/**
 * Mock Decrypter class
 */
export function mockDecrypter(): Decrypter {
  class DecrypterStub implements Decrypter {
    decrypt (encryptedValue: string): Promise<string> {
      return Promise.resolve('any-decrypted-value')
    }
  }
  return new DecrypterStub()
}

/**
 * Mock Hasher class
 */
export function mockHasher(): Hasher {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return Promise.resolve('hashed-password')
    }
  }
  return new HasherStub()
}