import request from "supertest";
import app from "@src/main/config/app";
import { MongoHelper } from "@src/infra/db/mongodb/helpers";
import { JWT_SECRET, MONGO_URL } from "@tests/settings";
import { Collection, ObjectId } from "mongodb";
import { sign } from "jsonwebtoken";
import { mockAddAccountParams, mockAddSurveysParams } from "@tests/helpers";

let surveyCollection: Collection;
let accountCollection: Collection;
let mongo: MongoHelper;
describe("Surveys Route", () => {
  beforeAll(async () => {
    mongo = MongoHelper.getInstance();
    await mongo.connect(MONGO_URL);
  });

  afterAll(async () => {
    await mongo.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await mongo.getCollection("surveys");
    accountCollection = await mongo.getCollection("accounts");
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    test("Should return 403 if user did not provide a valid accessToken", async () => {
      await request(app)
        .post("/api/surveys")
        .send(mockAddSurveysParams())
        .expect(403);
    });

    test("Should return 204 if user provide a valid accessToken", async () => {
      const accountWithRole = Object.assign(mockAddAccountParams(), {
        role: "ADMIN",
      });
      const account = await accountCollection.insertOne(accountWithRole);
      const id = account.insertedId.toString();
      const accessToken = sign(id, JWT_SECRET);

      await accountCollection.updateOne({ _id: new ObjectId(id) }, {
        $set: { accessToken },
      });

      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
        .send(mockAddSurveysParams())
        .expect(204);
    });
  });

  describe("GET /surveys", () => {
    test("Should return 403 if no access token is provided", async () => {
      await request(app)
        .get("/api/surveys")
        .expect(403);
    });

    test("Should return 200 or 204 on load surveys if user provide a valid accessToken", async () => {
      const account = await accountCollection.insertOne(mockAddAccountParams());
      const id = account.insertedId.toString();
      const accessToken = sign(id, JWT_SECRET);

      await accountCollection.updateOne({ _id: new ObjectId(id) }, {
        $set: { accessToken },
      });

      const randomBoolean = Math.random() < 0.5;
      if (randomBoolean) {
        await surveyCollection.insertOne(mockAddSurveysParams());
      }
      const statusCode = randomBoolean ? 200 : 204;

      await request(app)
        .get("/api/surveys")
        .set("x-access-token", accessToken)
        .send(mockAddSurveysParams())
        .expect(statusCode);
    });
  });
});
