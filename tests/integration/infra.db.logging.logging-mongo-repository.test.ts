import { MongoHelper } from "../../src/infra/db/mongodb/helpers/mongo-helper";
import { MONGO_URL } from "../settings";
import { LoggingMongoRepository } from "../../src/infra/db/mongodb/logging/logging-mongo-repository"
import { Collection } from "mongodb";

function makeSut(): LoggingMongoRepository {
  return new LoggingMongoRepository()
}

describe('Looging Error Mongo Repository' , () => {
  let loggingErrorsCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL);
  })

  afterAll(async () => {
    //await loggingErrorsCollection.deleteMany({})
    await MongoHelper.disconnect();
  })

  beforeEach(async () => {
    loggingErrorsCollection = await MongoHelper.getCollection("loggingErrors")
    await loggingErrorsCollection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await loggingErrorsCollection.countDocuments()

    expect(count).toBe(1)
  })
})
