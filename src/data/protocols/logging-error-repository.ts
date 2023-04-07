export interface LoggingErrorRepository {
  logError: (stack: string) => Promise<void>
}
