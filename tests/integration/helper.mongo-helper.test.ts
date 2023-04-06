import { MongoHelper as sut } from "../../src/infra/db/mongodb/helpers/mongo-helper" 
import { MONGO_URL_STG } from "../../src/settings"

describe('Mongo Helper' , () => {
  afterEach(async () => {
    await sut.disconnect()
  })

  test('Should set and unset values when connects and diconnects', async () => {
    await sut.connect(MONGO_URL_STG)
    let accountCollection = sut.getCollection("accounts")
    
    expect(accountCollection).toBeTruthy()
    expect(sut.client).toBeTruthy()
    expect(sut.uri).toBeTruthy()

    await sut.disconnect()
    expect(sut.client).toBeFalsy()
    expect(sut.uri).toBeFalsy()
  })
})
