export interface Decrypter {
  decryptAccountToken: (accountToken: string) => Promise<string>
}
