import { loginPath, surveysPath, signupPath, surveyResultPath } from './paths'
import { schemas, securitySchemes } from './schemas'
import { components } from './components'

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
  schemas,
  components: {
    securitySchemes,
    components
  }
}
