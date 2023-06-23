export interface Decrypter {
  decrypt: (encryptedString: string) => Promise<string | null>
}
