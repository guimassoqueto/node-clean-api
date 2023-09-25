export type AuthenticationParams = {
  email: string
  password: string
}

export type AuthenticationModel = {
  accessToken: string
  userName: string
}

export interface Authentication {
  auth: (
    authentication: AuthenticationParams,
  ) => Promise<AuthenticationModel | null>
}
