export interface DeleteUnverifiedAccountByAccountTokenRepository {
  deleteByAccountToken: (accountToken: string) => Promise<void>
}
