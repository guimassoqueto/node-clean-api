export interface HttpRequest {
  headers?: any
  query?: any
  body: any
}

export interface HttpResponse {
  statusCode: number
  body?: any
}
