import { Validation } from "@src/validation/validation";

export class ValidationSpy implements Validation {
  input: any
  result: Error | null = null

  validate (input: any): Error | null {
    this.input = input
    return this.result
  }
}