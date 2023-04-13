import { MONGO_URL } from "../settings"
import { MongoHelper } from "../../src/infra/db/mongodb/helpers/mongo-helper"
import { AddAccountMongoRepository } from "../../src/infra/db/mongodb/account-repository/account"
import { AddAccountModel } from "../../src/domain/usecases/add-account"
import { Collection } from "mongodb"

function makeAddAccountModel(): AddAccountModel {
  return {
    name: "any_name",
    email: "any_email",
    password: "any_password"
  }
}

function makeSut(): AddAccountMongoRepository {
  return new AddAccountMongoRepository()
}

let accountCollection: Collection
describe('Add Account Mongo Repository' , () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL);
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  afterEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts")
    await accountCollection.deleteMany({})
  })

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const accountToBeAdded = makeAddAccountModel()
    const account = await sut.add(accountToBeAdded)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(accountToBeAdded.name)
    expect(account.email).toBe(accountToBeAdded.email)
    expect(account.password).toBe(accountToBeAdded.password)
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe("bibaman")
    expect(account.email).toBe("bibaman@email.com")
    expect(account.password).toBe("bibamanPassword")
  })

})
