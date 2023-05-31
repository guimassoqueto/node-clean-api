export interface Decoder {
  decode: (encodedValue: string) => Promise<string>
}
