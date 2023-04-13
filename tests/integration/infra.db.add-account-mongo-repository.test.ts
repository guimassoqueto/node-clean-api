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

  test('Should return an account on loadbyEmail success', async () => {
    const sut = makeSut()
    const new_account = makeAddAccountModel()
    accountCollection.insertOne(new_account) // insere uma conta antes de buscá-la
    const account = await sut.loadByEmail(new_account.email) // busca a conta

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe(new_account.name)
    expect(account?.email).toBe(new_account.email)
    expect(account?.password).toBe(new_account.password)
  })

  test('Should throw if email is not found', async () => {
    const sut = makeSut()
    const promise = sut.loadByEmail("inexistent_email")

    await expect(promise).rejects.toThrow()
  })

})
