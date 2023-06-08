import { loginPath } from './paths'
import { accountSchema, loginSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'node-clean-api',
    description: 'API Node',
    version: '1.0.0'
  },
  servers: [
    { url: '/api' }
  ],
  tags: [
    { name: 'Account' }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    login: loginSchema
  }
}
