import { type IHttpRequest, type IHttpResponse } from './http'

export interface Controller {
  handle: (httpRequest: IHttpRequest) => IHttpResponse
}
