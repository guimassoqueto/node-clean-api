export interface Authentication {
  // TODO: remover null se necessario e refatorar teste
  auth: (email: string, password: string) => Promise<string | null>
}
