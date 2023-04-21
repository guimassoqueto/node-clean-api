export interface LoggingRepository {
  logError: (stack: string) => Promise<void>
}
