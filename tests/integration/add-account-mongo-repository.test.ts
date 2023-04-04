import { MONGO_URL } from "../../src/settings"
import { MongoHelper } from "../../src/infra/db/mongodb/helpers/mongo-helper"
import { AddAccountMongoRepository } from "../../src/infra/db/mongodb/account-repository/account"

function makeSut(): AddAccountMongoRepository {
  return new AddAccountMongoRepository()
}

describe('Add Account Mongo Repository' , () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL);
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  test('Should return an account on success', async () => {
    const sut = makeSut()

    const account = await sut.add({
      name: "any_name",
      email: "any_email",
      password: "any_password"
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe("any_name")
    expect(account.email).toBe("any_email")
    expect(account.password).toBe("any_password")
  })

})
