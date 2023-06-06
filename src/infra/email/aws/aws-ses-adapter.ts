import { type SESClient, type SendEmailCommandInput, SendEmailCommand } from '@aws-sdk/client-ses'
import { type EmailService, type EmailVerificationData, type EmailVerificationResponse } from '@src/domain/usecases/email/account-verification-mail'
import { APP_URL } from '@src/settings'

export class AwsSesAdapter implements EmailService {
  constructor (private readonly client: SESClient) { }

  async sendAccountVerificationEmail (emailVerificationInfo: EmailVerificationData): Promise<EmailVerificationResponse> {
    const { email, accountToken } = emailVerificationInfo

    const message: SendEmailCommandInput = {
      Source: 'node-clean-api@yopmail.com',
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: 'Account Verification' },
        Body: { // TODO: mudar formato do link. Para variável de ambiente?
          Html: { Data: `<a href="http://${APP_URL}/api/verify-account?accountToken=${accountToken}"> Text </a>` }
        }
      }
    }

    const command = new SendEmailCommand(message)
    const response = await this.client.send(command)

    return { statusCode: response.$metadata.httpStatusCode }
  }
}
