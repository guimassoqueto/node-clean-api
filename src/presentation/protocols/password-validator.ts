export interface PasswordValidator {
  isStrong: (password: string) => boolean
}
