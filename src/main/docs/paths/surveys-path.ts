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
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
