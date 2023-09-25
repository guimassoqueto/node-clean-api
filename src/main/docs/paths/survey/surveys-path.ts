export const surveysPath = {
  get: {
    security: [
      { apiKeyAuth: [] }
    ],
    tags: ['Survey'],
    summary: 'API to list all surveys',
    description: 'Resource to list all available surveys.',
    responses: {
      200: {
        description: 'List available surveys',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
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
  },
  post: {
    security: [
      { apiKeyAuth: [] }
    ],
    tags: ['Survey'],
    summary: 'API to create a new survey',
    description: 'Resource responsible to add a new survey.',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/surveyAdd'
          }
        }
      }
    },
    responses: {
      204: {
        $ref: '#/components/components/noContent'
      },
      400: {
        $ref: '#/components/components/badRequest'
      },
      403: {
        $ref: '#/components/components/forbidden'
      },
      500: {
        $ref: '#/components/components/serverError'
      }
    }
  }
}
