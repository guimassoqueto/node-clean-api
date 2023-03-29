import { SignUpControlller } from "../src/presentation/controllers/signup.controller"

describe('Sign Up Controlller' , () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpControlller();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  })

  test('should return fail', () => { 
    
    expect(1+1).toBe(2)
  })
})
