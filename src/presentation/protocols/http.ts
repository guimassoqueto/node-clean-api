export type HttpRequest = {
  headers?: any
  query?: any
  body?: any
  params?: any
}

export type HttpResponse = {
  statusCode: number
  body?: any
}
