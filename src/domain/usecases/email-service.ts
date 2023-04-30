export interface EmailVerificationResponse {
  statusCode?: number
}

export interface EmailVerificationData {
  email: string
  accountToken: string
}

// TODO: mover para presentation? Ou algum outro local?
export interface EmailService {
  sendAccountVerificationEmail: (emailVerificationInfo: EmailVerificationData) => Promise<EmailVerificationResponse>
}
