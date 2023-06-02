import { type EmailService } from '@src/domain/usecases/email-service'
import { AwsSesAdapter } from '@src/infra/email/aws/aws-ses-adapter'
import { AWS_SES_REGION, AWS_SES_ACCESS_KEY_ID, AWS_SES_ACCESS_KEY_SECRET } from '../../../../../settings'
import { SESClient, type SESClientConfig } from '@aws-sdk/client-ses'

const awsCredentials: SESClientConfig = {
  region: AWS_SES_REGION,
  credentials: {
    accessKeyId: AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: AWS_SES_ACCESS_KEY_SECRET
  }
}

const client = new SESClient(awsCredentials)

export function makeEmailService (): EmailService {
  return new AwsSesAdapter(client)
}
