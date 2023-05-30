import { AddSurveyRepository, AddSurveyModel } from '../../../src/data/usecases/add-survey/db-add-survey-protocols'
import { DbAddSurvey } from './../../../src/data/usecases/add-survey/db-add-survey-usecase'

function makeFakeSurvey(): AddSurveyModel {
  return {
    question: "any-question",
    answers: [
      { image: "any-image", answer: "any-answer" }
    ]
  }
}

function makeAddSurveyRepository(): AddSurveyRepository {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    add (surveyData: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}

type SutType = {
  sut: DbAddSurvey,
  addSurveyRepositoryStub: AddSurveyRepository
}

function makeSut(): SutType {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    sut, 
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey' , () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add")
    const newSurveyData = makeFakeSurvey()
    await sut.add(newSurveyData)

    expect(addSpy).toBeCalledWith(newSurveyData)
  })
})
