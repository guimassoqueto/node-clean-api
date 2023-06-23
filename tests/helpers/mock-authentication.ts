import { 
  Authentication, 
  AuthenticationParams, 
  AuthenticationResponse 
} from '@src/domain/usecases/account/authentication';
import { faker } from '@faker-js/faker'


/**
 * Mock Authentication class
 */
export class AuthenticationSpy implements Authentication {
  authetication: AuthenticationParams
  authenticationResponse: AuthenticationResponse = {
    accessToken: faker.string.uuid(),
    userName: faker.person.firstName()
  }

  async auth(authentication: AuthenticationParams): Promise<AuthenticationResponse | null> {
    this.authetication = authentication
    return Promise.resolve(this.authenticationResponse)
  }
}