import { loginPath } from './paths'
import { accountSchema, loginSchema, errorSchema } from './schemas'
import { badRequest, unauthorized, serverError } from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'node-clean-api',
    description: 'API Node',
    version: '1.0.0'
  },
  license: {
    name: 'ISC',
    url: 'https://opensource.org/license/isc-license-txt/'
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
    login: loginSchema,
    error: errorSchema
  },
  component: {
    badRequest,
    unauthorized,
    serverError
  }
}
