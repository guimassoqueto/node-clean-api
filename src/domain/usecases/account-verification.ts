export interface AccountVerification {
  // TODO: mudar tipo de retorno?
  verify: (accToken: string) => Promise<boolean>
}
