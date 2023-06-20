export const surveyResultPath = {
  put: {
    security: [
      { apiKeyAuth: [] }
    ],
    tags: ['SurveyResult'],
    summary: 'API create/change a survey\'s answer.',
    description: 'Resource responsible to register/modify a answer of a survey.',
    parameters: [
      {
        in: 'path',
        name: 'surveyId',
        required: true,
        schema: {
          type: 'string'
        }
      }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Successful signup',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/saveSurveyParamsResponse'
            }
          }
        }
      },
      403: {
        $ref: '#/components/components/forbidden'
      },
      404: {
        $ref: '#/components/components/notFound'
      },
      500: {
        $ref: '#/components/components/serverError'
      }
    }
  }
}
