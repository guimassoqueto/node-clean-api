export interface UpdateAccountVerifiedRepository {
  updateVerified: (id: string, verified: boolean) => Promise<void>
}
