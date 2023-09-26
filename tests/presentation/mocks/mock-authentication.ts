import {
  Authentication,
  AuthenticationModel,
  AuthenticationParams,
} from "@src/domain/usecases/account/authentication";
import { faker } from "@faker-js/faker";


function mockAuthenticationModel(): AuthenticationModel {
  return {
    accessToken: faker.string.uuid(),
    userName: faker.person.firstName(),
  }
}

export class AuthenticationSpy implements Authentication {
  authetication: AuthenticationParams;
  result: AuthenticationModel | null = mockAuthenticationModel();

  async auth(
    authentication: AuthenticationParams,
  ): Promise<AuthenticationModel | null> {
    this.authetication = authentication;
    return Promise.resolve(this.result);
  }
}