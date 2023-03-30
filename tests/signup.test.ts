import { SignUpControlller } from "../src/presentation/controllers/signup.controller"
import { MissingParamError } from "../src/presentation/errors/missing-param-error";
import { ValidationError } from "../src/presentation/errors/validation-error";
import { IHttpRequest } from "../src/presentation/protocols/http";

describe('Sign Up Controlller' , () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpControlller();

    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  })

  test('Should return 400 if no email is provided', () => { 
    const sut = new SignUpControlller();

    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  })

  test('Should return 400 if no password is provided', () => { 
    const sut = new SignUpControlller();

    const httpRequest: IHttpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  })

  })
})
