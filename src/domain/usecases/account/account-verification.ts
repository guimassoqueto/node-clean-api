export interface AccountVerification {
  verify: (accountToken: string) => Promise<string | null>
}
