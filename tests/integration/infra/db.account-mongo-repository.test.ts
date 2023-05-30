import { MONGO_URL } from "../../settings"
import { MongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper"
import { AccountMongoRepository } from "../../../src/infra/db/mongodb/account/account-mongo-repository"
import { Collection } from "mongodb"

function makeAccount() {
  return {
    name: "any_name",
    email: "any_email",
    password: "any_password",
    verified: false,
    createdAt: new Date(2023, 11, 31)
  }
}

function makeSut(): AccountMongoRepository {
  return new AccountMongoRepository()
}

let accountCollection: Collection
let mongo: MongoHelper 
describe('Add Account Mongo Repository' , () => {
  beforeAll(async () => {
    mongo = MongoHelper.getInstance()
    await mongo.connect(MONGO_URL)
  })

  afterAll(async () => {
    await mongo.disconnect();
  })

  afterEach(async () => {
    accountCollection = await mongo.getCollection("accounts")
    await accountCollection.deleteMany({})
  })

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const accountToBeAdded = makeAccount()
    const account = await sut.add(accountToBeAdded)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(accountToBeAdded.name)
    expect(account.email).toBe(accountToBeAdded.email)
    expect(account.password).toBe(accountToBeAdded.password)
  })

  test('Should return an account on loadbyEmail success', async () => {
    const sut = makeSut()
    const new_account = makeAccount()
    await accountCollection.insertOne(new_account) // insere uma conta antes de buscá-la
    const account = await sut.loadByEmail(new_account.email) // busca a conta

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe(new_account.name)
    expect(account?.email).toBe(new_account.email)
    expect(account?.password).toBe(new_account.password)
  })

  test('Should return an account on loadById success', async () => {
    const sut = makeSut()
    const new_account = makeAccount()
    const inserted_account = await accountCollection.insertOne(new_account) // insere uma conta antes de buscá-la
    const account = await sut.loadById(inserted_account.insertedId.toString()) // busca a conta

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe(new_account.name)
    expect(account?.email).toBe(new_account.email)
    expect(account?.password).toBe(new_account.password)
  })

  test('Should return null if the account with the provided email is not found', async () => {
    const sut = makeSut()
    const promise = sut.loadByEmail("inexistent_email")

    await expect(promise).resolves.toBeNull()
  })

  test('Should update the account access token on updateAccesToken success', async () => {
    const sut = makeSut()
    const res = await accountCollection.insertOne(makeAccount())
    await sut.updateAccessToken(res.insertedId.toString(), 'any_token') // atualiza o token
    const account = await accountCollection.findOne({ _id: res.insertedId })

    expect(account).toBeTruthy()
    expect(account?.accessToken).toBe('any_token')
  })

  test('Should update the verified field on updateVerified success', async () => {
    const sut = makeSut()
    const res = await accountCollection.insertOne(makeAccount())
    const account_before_update = await accountCollection.findOne({ _id: res.insertedId })
    expect(account_before_update).toBeTruthy()
    expect(account_before_update?.verified).toBe(false)

    await sut.updateVerified(res.insertedId.toString(), true) // atualiza o campo verified
    const account_after_update = await accountCollection.findOne({ _id: res.insertedId })
    expect(account_after_update?.verified).toBe(true)
  })

  test('Should change the id of an account, keeping the other fields exact the same', async () => {
    const sut = makeSut()
    const account = makeAccount()
    const res = await accountCollection.insertOne(account)
    let oldAccount = await accountCollection.findOne({ _id: res.insertedId })
    
    expect(oldAccount).toBeTruthy()
    
    const newAccount = await sut.changeId(res.insertedId.toString())
    oldAccount = await accountCollection.findOne({ _id: res.insertedId })

    expect(oldAccount).toBeFalsy()
    expect(newAccount).toBeTruthy()
    expect(newAccount?.createdAt).toStrictEqual(account.createdAt)
    expect(newAccount?.email).toEqual(account.email)
    expect(newAccount?.password).toEqual(account.password)
    expect(newAccount?.verified).toEqual(account.verified)
  })
})
