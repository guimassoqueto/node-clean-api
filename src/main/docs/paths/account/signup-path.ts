export const signupPath = {
  post: {
    tags: ['Account'],
    summary: 'API to register a new user',
    description: 'Resource responsible to register a new user.',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signup'
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
              $ref: '#/schemas/signupResponse'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
