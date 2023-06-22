import { SurveyResultMongoRepository } from "@src/infra/db/mongodb/survey-result/survey-result-mongo-repository";
import { MONGO_URL } from "@tests/settings";
import { MongoHelper } from "@src/infra/db/mongodb/helpers";
import { Collection, ObjectId } from "mongodb";
import { SurveyModel } from "@src/domain/models/survey";
import { AccountModel } from "@src/domain/models/account";
import {
  mockAddAccountParams,
  mockAddSurveysParams,
  MockDate,
  RealDate
} from "@tests/helpers";

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;
let mongo: MongoHelper;

async function createDbSurvey(): Promise<SurveyModel> {
  const newSurvey = await surveyCollection.insertOne(mockAddSurveysParams());
  const survey = await surveyCollection.findOne({ _id: newSurvey.insertedId });
  return mongo.mapper<SurveyModel>(survey);
}

async function createDbAccount(): Promise<AccountModel> {
  const newAccount = await accountCollection.insertOne(mockAddAccountParams());
  const account = await accountCollection.findOne({
    _id: newAccount.insertedId,
  });
  return mongo.mapper<AccountModel>(account);
}

describe("SurveyResultMongoRepository", () => {
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
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
    await surveyResultCollection.deleteMany({});
  });

  afterEach(async () => {
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
    await surveyResultCollection.deleteMany({});
  });

  describe("save()", () => {
    test("Should add a survey result if its new", async () => {
      const sut = new SurveyResultMongoRepository();
      const survey = await createDbSurvey();
      const account = await createDbAccount();
      await sut.save({
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        accountId: account.id,
        date: new Date(2030, 11, 31),
      });

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id)
      })

      expect(surveyResult).toBeTruthy();
    });

    test("Should update survey result if it is not new", async () => {
      const survey = await createDbSurvey();
      const account = await createDbAccount();
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[0].answer,
        accountId: new ObjectId(account.id),
        date: new Date(2030, 11, 31),
      });

      const sut = new SurveyResultMongoRepository();
      await sut.save({
        surveyId: survey.id,
        answer: survey.answers[1].answer,
        accountId: account.id,
        date: new Date(2030, 11, 31),
      });

      const surveyResult = await surveyResultCollection.find({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id)
      }).toArray()

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    });
  });

  describe('load()' , () => {
    test('Should load rurvey result ', async () => {
      const survey = await createDbSurvey();
      const account = await createDbAccount();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[0].answer,
          accountId: new ObjectId(account.id),
          date: new Date(2030, 11, 31),
        },
        {
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[0].answer,
          accountId: new ObjectId(account.id),
          date: new Date(2030, 11, 31),
        },
        {
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[1].answer,
          accountId: new ObjectId(account.id),
          date: new Date(2030, 11, 31),
        },
        {
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[1].answer,
          accountId: new ObjectId(account.id),
          date: new Date(2030, 11, 31),
        }
      ]);

      const sut = new SurveyResultMongoRepository();
      const surveyResult = await sut.loadBySurveyId(survey.id);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toStrictEqual(new ObjectId(survey.id));
      expect(surveyResult.answers[0].count).toEqual(2);
      expect(surveyResult.answers[0].percent).toEqual(50);
      expect(surveyResult.answers[1].count).toEqual(2);
      expect(surveyResult.answers[1].percent).toEqual(50);
      expect(surveyResult.answers[2].count).toEqual(0);
      expect(surveyResult.answers[2].percent).toEqual(0);
    })
  })
  
});
