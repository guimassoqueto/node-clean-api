export const loginPath = {
  post: {
    tags: ['Account'],
    summary: 'API to authenticate the user',
    description: 'Resource represents a login authentication for an already verified user',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/login'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Successful login',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/loginResponse'
            }
          }
        }
      },
      400: {
        $ref: '#/components/components/badRequest'
      },
      401: {
        $ref: '#/components/components/unauthorized'
      },
      500: {
        $ref: '#/components/components/serverError'
      }
    }
  }
}
