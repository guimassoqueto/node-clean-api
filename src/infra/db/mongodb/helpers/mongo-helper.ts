import { type Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null,
  uri: null,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(this.uri)
  },

  async disconnect (): Promise<void> {
    if (this.client) await (this.client as MongoClient).close()
    this.client = null
    this.uri = null
  },

  /**
   * Busca ou cria uma collection
   * @param name nome da collection
   * @returns a collection para CRUD
   */
  getCollection (name: string): Collection {
    return (this.client as MongoClient).db().collection(name)
  },

  /**
   * Analisa do objeto retornado em uma consulta feita no mongo e o adequa para
   * se encaixar no formato definido no genérico
   * @param object um objeto que representa um dado qualquer retornado do MongoDb
   * @returns O objeto formatado de acordo com a interface/tipo definida pelo genérico
   */
  mapper<T>(obj: any): T {
    if (!obj) throw new Error()
    const { _id, ...rest } = obj
    return Object.assign({}, rest, { id: _id.toString() }) as T
  }
}
