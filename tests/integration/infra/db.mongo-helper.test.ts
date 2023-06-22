import { MongoHelper } from "@src/infra/db/mongodb/helpers";
import { MONGO_URL } from "@tests/settings";

let sut: MongoHelper;
describe("Mongo Helper", () => {
  beforeAll(() => {
    sut = MongoHelper.getInstance();
  });

  afterEach(async () => {
    await sut.disconnect();
  });

  test("Should reconnect if connection is down", async () => {
    await sut.connect(MONGO_URL);
    let accountCollection = await sut.getCollection("accounts");

    expect(accountCollection).toBeTruthy();
    await sut.disconnect();

    accountCollection = await sut.getCollection("accounts");
    expect(accountCollection).toBeTruthy();
  });
});
