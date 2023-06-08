import { loginPath, surveysPath, signupPath, surveyResultPath } from './paths'
import {
  loginSchema,
  loginResponseSchema,
  signupSchema,
  signupResponseSchema,
  errorSchema,
  surveySchema,
  surveyAddSchema,
  surveyAnswerSchema,
  surveysSchema,
  apiKeyAuthSchema,
  saveSurveyParamsSchema,
  saveSurveyParamsResponseSchema
} from './schemas'
import {
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden,
  noContent
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
    { name: 'Account' }, { name: 'Survey' }, { name: 'SurveyResult' }
  ],
  paths: {
    '/signup': signupPath,
    '/login': loginPath,
    '/surveys': surveysPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
    loginResponse: loginResponseSchema,
    login: loginSchema,
    signup: signupSchema,
    signupResponse: signupResponseSchema,
    error: errorSchema,
    survey: surveySchema,
    surveyAdd: surveyAddSchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
    saveSurveyParams: saveSurveyParamsSchema,
    saveSurveyParamsResponse: saveSurveyParamsResponseSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    unauthorized,
    serverError,
    notFound,
    forbidden,
    noContent
  }
}
