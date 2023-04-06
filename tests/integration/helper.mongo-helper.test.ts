import { MongoHelper as sut } from "../../src/infra/db/mongodb/helpers/mongo-helper" 
import { MONGO_URL } from "../settings"

describe('Mongo Helper' , () => {
  afterEach(async () => {
    await sut.disconnect()
  })

  test('Should set and unset values when connects and diconnects', async () => {
    await sut.connect(MONGO_URL)
    let accountCollection = sut.getCollection("accounts")
    
    expect(accountCollection).toBeTruthy()
    expect(sut.client).toBeTruthy()
    expect(sut.uri).toBeTruthy()

    await sut.disconnect()
    expect(sut.client).toBeFalsy()

    // a uri permanece definida, só sendo modificada em uma nova connect()
    expect(sut.uri).toBeTruthy()
  })

  test('Should reconnect if connection is down', async () => {
    await sut.connect(MONGO_URL)
    let accountCollection = await sut.getCollection("accounts")

    expect(accountCollection).toBeTruthy()
    await sut.disconnect()

    accountCollection = await sut.getCollection("accounts")
    expect(accountCollection).toBeTruthy()
  })
})
