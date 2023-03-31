export interface PasswordValidator {
  isStrong: (password: string) => Promise<boolean>
}
