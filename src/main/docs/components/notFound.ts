export const notFound = {
  description: '404 Not Found. Occurs when the resource is not found.',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
