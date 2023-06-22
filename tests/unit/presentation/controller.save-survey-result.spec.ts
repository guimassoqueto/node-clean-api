import { SaveSurveyResultController } from "@src/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller";
import { HttpRequest } from "@src/presentation/protocols";
import { forbidden, ok, serverError } from "@src/presentation/helpers/http";
import {
  InvalidParamError,
  LoadSurveyById,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SurveyModel,
  SurveyResultModel,
} from "@src/presentation/controllers/survey-result/save-survey-result/save-survey-result-protocols";
import { MockDate, mockSurveyModel, RealDate } from "@tests/helpers";

function mockSaveSurveyResult(): SaveSurveyResult {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResult());
    }
  }
  return new SaveSurveyResultStub();
}

function mockLoadSurveyById(): LoadSurveyById {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel | null> {
      return Promise.resolve(mockSurveyModel());
    }
  }
  return new LoadSurveyByIdStub();
}

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

function makeSut(): SutTypes {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const saveSurveyResultStub = mockSaveSurveyResult();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub,
  );

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub,
  };
}

function mockRequest(): HttpRequest {
  const answers = mockSurveyModel().answers;
  const answer = answers[Math.floor(Math.random() * answers.length)].answer;
  return {
    params: {
      surveyId: "any-id",
    },
    body: {
      answer,
    },
    accountId: "any-account-id",
  };
}

function mockSurveyResult(): SurveyResultModel {
  return {
    surveyId: "valid-survey-id",
    question: "valid-question",
    answers: [
      {
        image: "any-image-1",
        answer: "any-answer-1",
        count: 50,
        percent: 50,
      },
      {
        image: "any-image-2",
        answer: "any-answer-2",
        count: 50,
        percent: 50,
      },
    ],
    date: new Date(2030, 11, 31),
  };
}

describe("SaveSurveyResultController", () => {
  beforeAll(() => {
    (global as any).Date = MockDate;
  });

  afterAll(() => {
    (global as any).Date = RealDate;
  });

  test("Should call LoadSurveyById with correct args", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, "loadById");
    const request = mockRequest();

    await sut.handle(request);
    expect(loadByIdSpy).toHaveBeenCalledWith(request.params.surveyId);
  });

  test("Should return 401 if surveyId does not exist", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, "loadById").mockResolvedValueOnce(null);
    const request = mockRequest();

    const response = await sut.handle(request);
    expect(response).toStrictEqual(
      forbidden(new InvalidParamError("surveyId")),
    );
  });

  test("Should return 500 if surveyId throws", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const error = new Error();
    jest.spyOn(loadSurveyByIdStub, "loadById").mockRejectedValueOnce(error);
    const request = mockRequest();

    const response = await sut.handle(request);
    expect(response).toStrictEqual(serverError(error));
  });

  test("Should return 403 if an invalid answer is provided", async () => {
    const { sut } = makeSut();
    const request = mockRequest();
    request.body = {
      answer: "wrong-answer",
    };

    const response = await sut.handle(request);
    expect(response).toStrictEqual(forbidden(new InvalidParamError("answer")));
  });

  test("Should call SaveSurveyResult with correct args", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, "save");
    const request = mockRequest();
    await sut.handle(request);

    expect(saveSpy).toBeCalledWith({
      accountId: request.accountId,
      surveyId: request.params.surveyId,
      answer: request.body.answer,
      date: new Date(),
    });
  });

  test("Should return 500 if SaveSurveyResult throws", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const error = new Error();
    jest.spyOn(saveSurveyResultStub, "save").mockRejectedValueOnce(error);
    const request = mockRequest();

    const response = await sut.handle(request);
    expect(response).toStrictEqual(serverError(error));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const request = mockRequest();

    const response = await sut.handle(request);
    expect(response).toStrictEqual(ok(mockSurveyResult()));
  });
});
