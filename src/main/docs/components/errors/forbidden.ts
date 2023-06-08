export const forbidden = {
  description: '403 Forbidden. Occurs when the user does not have permissions to acces the API.',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
