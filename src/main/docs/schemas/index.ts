import { signupSchema } from './account/signup/signup-schema'
import { signupResponseSchema } from './account/signup/signup-response-schema'
import { loginSchema } from './account/login/login-schema'
import { loginResponseSchema } from './account/login/login-response-schema'
import { surveySchema } from './survey/survey-schema'
import { surveyAddSchema } from './survey/survey-add-schema'
import { surveysSchema } from './survey/surveys-schema'
import { surveyAnswerSchema } from './survey/survey-answer-schema'
import { saveSurveyParamsSchema } from './survey-result/save-survey-params-schema'
import { saveSurveyParamsResponseSchema } from './survey-result/save-survey-params-response-schema'
import { errorSchema } from './error/error-schema'
import { apiKeyAuthSchema } from './auth/api-key-auth-schema'

export const schemas = {
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
}

export const securitySchemes = {
  apiKeyAuth: apiKeyAuthSchema
}
