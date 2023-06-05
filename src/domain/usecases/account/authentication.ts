export type AuthenticationModel = {
  email: string
  password: string
}

export interface Authentication {
  // TODO: remover null se necessario e refatorar teste
  auth: (authentication: AuthenticationModel) => Promise<string | null>
}
