export type AuthenticationParams = {
  email: string
  password: string
}

export type AuthenticationResponse = {
  accessToken: string
  userName: string
}

export interface Authentication {
  auth: (authentication: AuthenticationParams) => Promise<AuthenticationResponse | null>
}
