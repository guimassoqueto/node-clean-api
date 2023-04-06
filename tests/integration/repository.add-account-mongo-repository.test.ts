import { MONGO_URL_STG } from "../../src/settings"
import { MongoHelper } from "../../src/infra/db/mongodb/helpers/mongo-helper"
import { AddAccountMongoRepository } from "../../src/infra/db/mongodb/account-repository/account"

function makeSut(): AddAccountMongoRepository {
  return new AddAccountMongoRepository()
}

describe('Add Account Mongo Repository' , () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL_STG);
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  afterEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts")
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    const sut = makeSut()

    const account = await sut.add({
      name: "bibaman",
      email: "bibaman@email.com",
      password: "bibamanPassword"
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe("bibaman")
    expect(account.email).toBe("bibaman@email.com")
    expect(account.password).toBe("bibamanPassword")
  })

})
