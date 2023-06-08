export const serverError = {
  description: '500 Server Error. Occurs whenever the application throws an error internally.',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
