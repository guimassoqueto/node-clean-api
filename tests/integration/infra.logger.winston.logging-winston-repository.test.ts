import { LoggingRepository } from "../../src/data/protocols/db/logging/logging-error-repository"
import { LoggingWinstonRepository } from "../../src/infra/logger/winston/logging-winston-repository"
import winston, { Logger, createLogger } from "winston"

function makeLoggerStub(): Logger {
  return createLogger({
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
  })
}

interface SutTypes {
  sut: LoggingRepository,
  loggerStub: Logger
}

function makeSut(): SutTypes {
  const loggerStub = makeLoggerStub()
  const sut = new LoggingWinstonRepository(loggerStub)

  return {
    sut,
    loggerStub
  }
}

describe('LoggingWinstonRepository', () => {
  test('logger should be called with correct values', async () => {
    const { sut, loggerStub } = makeSut()
    const errorSpy = jest.spyOn(loggerStub, "error");

    await sut.logError("any stack error")
    expect(errorSpy).toBeCalledWith("any stack error")
  })
})
