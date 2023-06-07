export type EmailVerificationResponse = {
  statusCode?: number
}

export type EmailVerificationParams = {
  email: string
  accountToken: string
}

export interface EmailService {
  sendAccountVerificationEmail: (emailVerificationParams: EmailVerificationParams) => Promise<EmailVerificationResponse>
}
