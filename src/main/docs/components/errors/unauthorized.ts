export const unauthorized = {
  description: '401 Unauthorized. Occurs whenever the user provide invalid credentials (email or password).',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
