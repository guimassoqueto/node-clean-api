export const signupResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string'
    },
    account: {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        name: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        password: {
          type: 'string'
        },
        verified: {
          type: 'boolean',
          default: false
        },
        createdAt: {
          type: 'string'
        }
      }
    }
  }
}
