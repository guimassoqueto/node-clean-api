import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'
import { type Request, type Response } from 'express'

/**
 * Função que recebe uma classe que implementa o método Controller
 * e adapta os parâmetros para um formato no qual o express espera receber,
 * nest caso o formato HttpRequest do controller deve ser modificado para se enquadrar
 * no formato Request do express
 */
export function adaptRoute (controller: Controller) {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
