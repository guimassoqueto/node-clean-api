type DecryptType = Record<string, any>

export interface Decrypter {
  decrypt: (encryptedValue: string) => Promise<DecryptType>
}
