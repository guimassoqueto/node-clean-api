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
        $ref: '#/component/badRequest'
      },
      401: {
        $ref: '#/component/unauthorized'
      },
      500: {
        $ref: '#/component/serverError'
      }
    }
  }
}
