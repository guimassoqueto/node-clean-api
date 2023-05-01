export interface AccountVerification {
  // TODO: mudar tipo de retorno?
  verify: (accountToken: string) => Promise<string | null>
}
