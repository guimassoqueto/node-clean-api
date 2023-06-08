export const badRequest = {
  description: '400 Bad Request. Occurs when the user do not provide the requided fields properly.',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
