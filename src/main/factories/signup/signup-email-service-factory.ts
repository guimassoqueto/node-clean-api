import { type EmailService } from '../../../presentation/protocols'
import { AwsSesAdapter } from '../../../infra/email/aws-ses-adapter'
import { AWS_SES_REGION, AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_SECRET } from '../../../settings'
import { SESClient, type SESClientConfig } from '@aws-sdk/client-ses'

const awsCredentials: SESClientConfig = {
  region: AWS_SES_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_ACCESS_KEY_SECRET
  }
}

const client = new SESClient(awsCredentials)

export function makeEmailService (): EmailService {
  return new AwsSesAdapter(client)
}
