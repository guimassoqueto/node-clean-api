import { type Collection, MongoClient } from 'mongodb'

// Design Pattern: Singleton
export class MongoHelper {
  public client: MongoClient
  public uri: string

  private static instance: MongoHelper

  private constructor () {}

  public static getInstance (): MongoHelper {
    if (!MongoHelper.instance) {
      MongoHelper.instance = new MongoHelper()
    }

    return MongoHelper.instance
  }

  public async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(this.uri, { connectTimeoutMS: 5000 })
  }

  public async disconnect (): Promise<void> {
    if (this.client) await this.client.close()
  }

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) await this.connect(this.uri)
    return this.client.db().collection(name)
  }

  public mapper<T>(obj: any): T {
    if (!obj) throw new Error()
    const { _id, ...rest } = obj
    return Object.assign({}, rest, { id: _id.toString() }) as T
  }

  public arrayMapper<T>(objArray: any[]): T[] {
    return objArray.map(obj => {
      const { _id, ...rest } = obj
      return Object.assign({}, rest, { id: _id.toString() }) as T
    })
  }
}
