import request from "supertest";
import app from "@src/main/config/app";
import { MongoHelper } from "@src/infra/db/mongodb/helpers";
import { MONGO_URL, SALT_ROUNDS } from "@tests/settings";
import { Collection } from "mongodb";
import { hash } from "bcrypt";


let accountCollection: Collection;
let mongo: MongoHelper;
describe("Login Route", () => {
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

  describe("POST /signup", () => {
    test("Should return 200 on signup", async () => {
      await request(app)
        .post("/api/signup")
        .send({
          name: "Guilherme",
          email: "guilhermemassoqueto@gmail.com",
          password: "###!!!123GGGaaa",
          passwordConfirmation: "###!!!123GGGaaa",
        })
        .expect(200);
    });

    test("Should return the field createdAt after every sucessfull signup", async () => {
      const response = await request(app)
        .post("/api/signup")
        .send({
          name: "Guilherme",
          email: "guilhermemassoqueto@gmail.com",
          password: "###!!!123GGGaaa",
          passwordConfirmation: "###!!!123GGGaaa",
        })
        .expect(200);

      expect(response.body.account.createdAt).toBeTruthy();
    });

    test("Should return 409 on second signup with an already registered email", async () => {
      const email = "any_email@email.com";
      // first try should return 200
      await request(app)
        .post("/api/signup")
        .send({
          name: "Guilherme",
          email,
          password: "###!!!123GGGaaa",
          passwordConfirmation: "###!!!123GGGaaa",
        })
        .expect(200);

      // second try should return 409
      await request(app)
        .post("/api/signup")
        .send({
          name: "Guilherme",
          email,
          password: "###!!!123GGGaaa",
          passwordConfirmation: "###!!!123GGGaaa",
        })
        .expect(409);

      // certifica que apenas a primeira inserção foi adicionada ao banco
      const accounts = await accountCollection.countDocuments({ email });
      expect(accounts).toBe(1);
    });
  });

  describe("POST /login", () => {
    test("Should return 200 on login", async () => {
      const rawPassword = "321!@#qweEWQ";
      const passwordHash = await hash(rawPassword, SALT_ROUNDS);

      const newUser: {
        name: string;
        email: string;
        password: string;
      } = {
        name: "any_user",
        email: "any_email@email.com",
        password: passwordHash,
      };

      await accountCollection.insertOne(newUser);

      await request(app)
        .post("/api/login")
        .send({
          email: newUser.email,
          password: rawPassword,
        })
        .expect(200);
    });

    test("Should return 401 on invalid credentials", async () => {
      await request(app)
        .post("/api/login")
        .send({
          email: "inexistent_email@email.com",
          password: "4sd35gf354dfs$#%#$SDgvf",
        })
        .expect(401);
    });
  });
});
