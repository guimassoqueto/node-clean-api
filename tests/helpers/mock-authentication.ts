import {
  Authentication,
  AuthenticationModel,
  AuthenticationParams,
} from "@src/domain/usecases/account/authentication";
import { faker } from "@faker-js/faker";

/**
 * Mock Authentication class
 */
export class AuthenticationSpy implements Authentication {
  authetication: AuthenticationParams;
  AuthenticationModel: AuthenticationModel = {
    accessToken: faker.string.uuid(),
    userName: faker.person.firstName(),
  };

  async auth(
    authentication: AuthenticationParams,
  ): Promise<AuthenticationModel | null> {
    this.authetication = authentication;
    return Promise.resolve(this.AuthenticationModel);
  }
}
