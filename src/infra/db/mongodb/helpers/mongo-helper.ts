import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    if (this.client) await (this.client as MongoClient).close()
  }
}
