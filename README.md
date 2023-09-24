# node-clean-api
A full working API built using the top industry standards. TDD, Object-oriented programming, SOLID principles, Design Patterns, Security, among others.

## Usecase Diagram
TODO

## Class Diagram
TODO

## Sequence Diagrams

### SignUp Diagram
TODO

### Login Diagram
TODO

## Running the application locally

### For Linux (Debian) Users
1. Install buid-essential package (to be able to run `make` commands): `sudo apt-get install build-essential`
2. `make env` to set *compose.env* and *.env*
* To run the app fully containerized (skip steps 3 and 4): `make up`
3. `make i` to install all package.json dependencies
4. Choose between:  
-- `make sts` to run the application without transpile the code to javascript  
-- `make sjs` to transpile the code to javascript and run it

### For Windows Users
1. Install [Chocolatey Package Manager](https://chocolatey.org/install)
2. Install make package (to be able to run `make` commands): `choco install make`
3. Set the *.env* file and the *compose.env* file similar to the *.env.example* file. See [Enviromnet Varibles](https://github.com/guimassoqueto/node-api-clean-architecture#environment-variables)
* To run the app fully containerized (skip steps 3, 4, and 5 in this case): `make up`
4. `make i` to install all package.json dependencies
5. Choose between:  
-- `make sts` to run the application without transpile the code to javascript  
-- `make sjs` to transpile the code to javascript and run it

## Environment Variables

**PS**: `MONGO_HOST` must be `mongodb`  in *compose.env*  
**PS**: `MONGO_URL` ***must not*** be defined in *compose.env*   
**PS**: If you change any variable in *.env*, change to the same value in *compose.env*, except for the two variables above  

| VARIABLE              | DEFAULT VALUE              | DEFINITION                                                               | REQUIRED                 |
| --------------------- | -------------------------- | ------------------------------------------------------------------------ | ------------------------ |
| `ENVIRONMENT`         | `dev`                      | environment in which the app is running (necessary to run logs properly) | :heavy_multiplication_x: |
| `MONGO_ROOT_USERNAME` | `username`                 | mongo user                                                               | :heavy_check_mark:       |
| `MONGO_ROOT_PASSWORD` | `password`                 | mongo password                                                           | :heavy_check_mark:       |
| `MONGO_HOST`          | `localhost`                | mongo ip                                                                 | :heavy_check_mark:       |
| `MONGO_PORT`          | `27017`                    | port where mongo is listening                                            | :heavy_check_mark:       |
| `APP_HOST`            | `localhost`                | API's host                                                               | :heavy_multiplication_x: |
| `APP_PORT`            | `8000`                     | API's port                                                               | :heavy_multiplication_x: |
| `APP_URL`             | `${APP_HOST}:${APP_PORT}"` | API's URL                                                                | :heavy_multiplication_x: |
| `JWT_SECRET`          | `secret`                   | Private Secret for jwt                                                   | :heavy_multiplication_x: |
| `SALT_ROUNDS`         | `12`                       | number of rounds for encryption                                          | :heavy_multiplication_x: |
| `MONGO_URL`           | `""`                       | mongo url (for remote mongo)                                             | :heavy_multiplication_x: |


### Additional Commands (see [Makefile](Makefile))
* `make i`: install all package.json dependencies (including devDependencies)
* `make down`: stops containers and removes containers, networks, volumes, and images created
* `make t`: run all tests (unit, integration, and end-to-end)
* `make ut`: run all the unit tests
* `make it`: run all the integration tests
* `make c`: show the test coverage of the app (first run `make t` or `make ut` or `make it`)
* `make b`: transpile the typescript code located in *src/* to javascript (will be located in *dist/*)
* `make bi`: build the application image using Docker
* `make tsw`: transpile in real-time the code to javascript
* `make nw`: execute the app with changes in real-time (works with tsc-watch)


TODO:
- [x] Create an Email interface to handle emails, for validations, password recovery, etc [AWS SES]
- [x] Create an Adpater that implements Email interface and send emails. The Adapter should Implement an email service, like [Sendgrid](https://www.npmjs.com/package/@sendgrid/mail) or [Nodemailer](https://www.npmjs.com/package/nodemailer)
- [ ] UML Structure - Class Diagram
- [ ] UML Behavior - Use Case Diagram
- [ ] UML Interaction - Sequence Diagram
- [x] Add dependabot
- [x] Add Github Actions Pipeline
- [ ] Add MongoDb in Github Actions to run integration tests
- [ ] Add Performance test reports using [K6](https://k6.io/)
- [x] Create Kubernetes files to allow the application to run in pods
- [ ] Deploy the application in AWS EKS or GCP Kubernetes Engine
- [x] Integrate the application with [Logtail](https://logtail.com) for observability
- [x] Evaluate whether tests should have their own settings.ts
- [x] Add a logging library to manage application logs. See [Winston](https://www.npmjs.com/package/winston)
- [ ] Add diagram for LoginController
- [x] Define whether JWT_SECRET and SALT_ROUNDS should be defined in settings.ts should be raw written in the code, or be migrated to *.env*
