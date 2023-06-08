import { loginPath, surveysPath } from './paths'
import {
  accountSchema,
  loginSchema,
  errorSchema,
  surveySchema,
  surveyAnswerSchema,
  surveysSchema,
  apiKeyAuthSchema
} from './schemas'
import {
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden
} from './components'

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
    { name: 'Account' }, { name: 'Survey' }
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveysPath
  },
  schemas: {
    account: accountSchema,
    login: loginSchema,
    error: errorSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    unauthorized,
    serverError,
    notFound,
    forbidden
  }
}
