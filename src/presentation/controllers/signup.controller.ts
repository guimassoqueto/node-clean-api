import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { type IHttpRequest, type IHttpResponse } from '../protocols/http'

export class SignUpControlller {
  public handle (httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields: string[] = ['name', 'email', 'password']

    // checa se os campos obrigatórios esperados estão presentes no corpo da requisição

    for (const field of requiredFields) {
      if (!(field in httpRequest.body)) return badRequest(new MissingParamError(field))
    }

    return {
      statusCode: 200,
      body: 'Success'
    }
  }
}
