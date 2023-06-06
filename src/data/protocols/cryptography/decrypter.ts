export interface Decrypter {
  decrypt: (encryptedValue: string) => Promise<string | null>
}
