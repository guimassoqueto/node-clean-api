import { Collection } from "mongodb";
import { MONGO_URL } from "@tests/settings";
import { AccountModel } from "@src/domain/models/account";
import { MongoHelper } from "@src/infra/db/mongodb/helpers";
import { AccountMongoRepository } from "@src/infra/db/mongodb/account/account-mongo-repository";

interface AccountModelWithToken extends Omit<AccountModel, "id"> {
  accessToken: string;
}

export function mockAccountWithToken(): AccountModelWithToken {
  return {
    name: "any-name",
    email: "any-email@email.com",
    password: "any-password",
    createdAt: new Date(2030, 11, 31),
    accessToken: "any-token",
  };
}

function makeSut(): AccountMongoRepository {
  return new AccountMongoRepository();
}

let accountCollection: Collection;
let mongo: MongoHelper;
describe("Add Account Mongo Repository", () => {
  beforeAll(async () => {
    mongo = MongoHelper.getInstance();
    await mongo.connect(MONGO_URL);
  });

  afterAll(async () => {
    await mongo.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await mongo.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  test("Should return an account on add success", async () => {
    const sut = makeSut();
    const accountToBeAdded = mockAccountWithToken();
    const account = await sut.add(accountToBeAdded);

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe(accountToBeAdded.name);
    expect(account.email).toBe(accountToBeAdded.email);
    expect(account.password).toBe(accountToBeAdded.password);
  });

  describe("loadByEmail()", () => {
    test("Should return an account on loadbyEmail success", async () => {
      const sut = makeSut();
      const new_account = mockAccountWithToken();
      await accountCollection.insertOne(new_account); // insere uma conta antes de buscá-la
      const account = await sut.loadByEmail(new_account.email); // busca a conta

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe(new_account.name);
      expect(account?.email).toBe(new_account.email);
      expect(account?.password).toBe(new_account.password);
    });

    test("Should return null if the account with the provided email is not found", async () => {
      const sut = makeSut();
      const promise = sut.loadByEmail("inexistent_email");

      await expect(promise).resolves.toBeNull();
    });
  });

  describe("loadById()", () => {
    test("Should return an account on loadById success", async () => {
      const sut = makeSut();
      const new_account = mockAccountWithToken();
      const inserted_account = await accountCollection.insertOne(new_account); // insere uma conta antes de buscá-la
      const account = await sut.loadById(
        inserted_account.insertedId.toString(),
      ); // busca a conta

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe(new_account.name);
      expect(account?.email).toBe(new_account.email);
      expect(account?.password).toBe(new_account.password);
    });
  });

  describe("updateAccessToken()", () => {
    test("Should update the account access token on updateAccessToken success", async () => {
      const sut = makeSut();
      const res = await accountCollection.insertOne(mockAccountWithToken());
      await sut.updateAccessToken(res.insertedId.toString(), "any_token"); // atualiza o token
      const account = await accountCollection.findOne({ _id: res.insertedId });

      expect(account).toBeTruthy();
      expect(account?.accessToken).toBe("any_token");
    });
  });

  describe("loadByToken()", () => {
    test("Should return an account on loadByToken success without role", async () => {
      const sut = makeSut();
      const new_account = mockAccountWithToken();

      await accountCollection.insertOne(new_account);
      const account = await sut.loadByToken(new_account.accessToken);

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe(new_account.name);
      expect(account?.email).toBe(new_account.email);
      expect(account?.password).toBe(new_account.password);
    });

    test("Should return an account on loadByToken success with ADMIN role", async () => {
      const sut = makeSut();
      const new_account = mockAccountWithToken();
      new_account["role"] = "ADMIN";

      await accountCollection.insertOne(new_account);
      const account = await sut.loadByToken(new_account.accessToken, "ADMIN");

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe(new_account.name);
      expect(account?.email).toBe(new_account.email);
      expect(account?.password).toBe(new_account.password);
    });

    test("Should return null loadByToken with invalid role", async () => {
      const sut = makeSut();
      const new_account = mockAccountWithToken();

      await accountCollection.insertOne(new_account);
      const account = await sut.loadByToken(new_account.accessToken, "ADMIN");

      expect(account).toBeNull();
    });

    test("Should return an account on loadByToken if user is ADMIN", async () => {
      const sut = makeSut();
      const new_account = mockAccountWithToken();
      new_account["role"] = "ADMIN";

      await accountCollection.insertOne(new_account);
      const account = await sut.loadByToken(new_account.accessToken);

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe(new_account.name);
      expect(account?.email).toBe(new_account.email);
      expect(account?.password).toBe(new_account.password);
    });

    test("Should return null if loadByToken fails", async () => {
      const sut = makeSut();
      const account = await sut.loadByToken("any-token", "any-role");

      expect(account).toBeNull();
    });
  });
});
