export type HttpRequest = {
  headers?: any
  query?: any
  body?: any
  params?: any
  accountId?: string
}

export type HttpResponse = {
  statusCode: number
  body?: any
}
