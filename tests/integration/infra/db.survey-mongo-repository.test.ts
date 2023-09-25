import { SurveyMongoRepository } from "@src/infra/db/mongodb/survey/survey-mongo-repository";
import { MONGO_URL } from "@tests/settings";
import { MongoHelper } from "@src/infra/db/mongodb/helpers";
import { Collection, ObjectId } from "mongodb";
import { mockAddSurveysParams, MockDate, RealDate } from "@tests/helpers";
import { AccountModel } from "@src/domain/models/account";
import { mockAddAccountParams } from '@tests/helpers'
import { faker } from "@faker-js/faker";

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;
let mongo: MongoHelper;


async function createDbAccount(): Promise<AccountModel> {
  const newAccount = await accountCollection.insertOne(mockAddAccountParams());
  const account = await accountCollection.findOne({
    _id: newAccount.insertedId,
  });
  return mongo.mapper<AccountModel>(account);
}


describe("SurveyMongoRepository", () => {
  beforeAll(async () => {
    (global as any).Date = MockDate;
    mongo = MongoHelper.getInstance();
    await mongo.connect(MONGO_URL);
  });

  afterAll(async () => {
    (global as any).Date = RealDate;
    await mongo.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await mongo.getCollection("surveys");
    accountCollection = await mongo.getCollection("accounts");
    surveyResultCollection = await mongo.getCollection("surveyResults");
    await surveyCollection.deleteMany({})
  });

  afterEach(async () => {
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
  });

  describe("add()", () => {
    test("Should add a survey on success", async () => {
      const sut = new SurveyMongoRepository();
      await sut.add(mockAddSurveysParams());
      const survey = await surveyCollection.findOne({
        question: "any-question",
      });
      expect(survey).toBeTruthy();
      expect(survey?._id).toBeTruthy();
    });
  });

  describe("loadAll()", () => {
    test("Should return a correct quantity of Surveys on loadAll success", async () => {
      const account = await createDbAccount()
      const addSurveyModels = [mockAddSurveysParams(), mockAddSurveysParams()]
      const result = await surveyCollection.insertMany(addSurveyModels)
      const surveyId = result.insertedIds["0"] // pega o primeiro inserido para teste
      const survey = await surveyCollection.findOne({_id: new ObjectId(surveyId)}) 
      await surveyResultCollection.insertOne({
        surveyId: surveyId,
        accountId: new ObjectId(account.id),
        answer: survey?.answers[0].answer,
        date: new Date()
      })
      const sut = new SurveyMongoRepository()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toEqual(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toEqual(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    });

    test("Should return a empty list loadAll if there is no Surveys on DB", async () => {
      const account = await createDbAccount()
      const sut = new SurveyMongoRepository();
      const surveys = await sut.loadAll(account.id);
      expect(surveys).toStrictEqual([]);
      expect(surveys.length).toStrictEqual(0);
    });
  });

  describe("loadById()", () => {
    test("Should load a survey on loadById success", async () => {
      const newSurvey = await surveyCollection.insertOne(
        mockAddSurveysParams(),
      );
      const newSurveyId = newSurvey.insertedId.toString();
      const sut = new SurveyMongoRepository();
      const survey = await sut.loadById(newSurveyId);

      expect(survey).toBeTruthy();
    });
  });
});
