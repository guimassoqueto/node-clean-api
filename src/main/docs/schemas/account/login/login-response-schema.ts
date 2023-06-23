export const loginResponseSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string'
    },
    userName: {
      type: 'string'
    }
  }
}
