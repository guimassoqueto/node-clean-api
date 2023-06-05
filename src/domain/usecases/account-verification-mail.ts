export type EmailVerificationResponse = {
  statusCode?: number
}

export type EmailVerificationData = {
  email: string
  accountToken: string
}

// TODO: mover para presentation? Ou algum outro local?
export interface EmailService {
  sendAccountVerificationEmail: (emailVerificationInfo: EmailVerificationData) => Promise<EmailVerificationResponse>
}