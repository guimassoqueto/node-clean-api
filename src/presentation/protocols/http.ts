export interface HttpRequest {
  query?: any
  body: any
}

export interface HttpResponse {
  statusCode: number
  body?: any
}
