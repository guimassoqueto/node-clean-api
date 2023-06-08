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
              $ref: '#/schemas/account'
            }
          }
        }
      },
      400: {
        description: '400 Bad Request'
      },
      401: {
        description: '401 Unauthorized'
      },
      500: {
        description: '500 Internal Server Error'
      }
    }
  }
}
