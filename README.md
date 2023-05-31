# node-clean-api
A full working API built using the top industry standards. TDD, Object-oriented programming, SOLID principles, Design Patterns, Security, among others.

## Usecase Diagram
![Node API Usecase Diagram](/diagrams/UML/node-api.usecase.drawio.png)

## Class Diagram
*PS:* to see the complete diagram, with states and behaviors, open [this file](/diagrams/UML/node-api.class.drawio) with the app [Diagrams.net](https://www.diagrams.net/)
![Node API Class Diagram](/diagrams/UML/node-api.class.drawio.png)

## Sequence Diagrams

### SignUp Diagram
![Node API SignUp Sequence Diagram](/diagrams/UML/node-api.signup.sequence.drawio.png)

### Login Diagram
![Node API Class Diagram](/diagrams/UML/node-api.login.sequence.drawio.png)

## Requirements (for all users)
* [Node 20+](https://nodejs.org/en)
* [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/)

## Optional Requirements
If you want to try the application in a Kubernetes cluster, but before want to test locally:  
* [kubectl](https://kubernetes.io/docs/tasks/tools/)
* [minikube](https://minikube.sigs.k8s.io/docs/start/)

If you want to access the application running locally without deploy it in a remote server:
* [ngrok](https://ngrok.com/)

## Running the application locally

### For Linux (Debian) Users
1. Install buid-essential package (to be able to run `make` commands): `sudo apt-get install build-essential`
2. `make env` to set *compose.env* and *.env*
* To run the app fully containerized (skip steps 3 and 4): `make up`
3. `make install` to install all package.json dependencies
4. Choose between:  
-- `make start-ts` to run the application without transpile the code to javascript  
-- `make start-js` to transpile the code to javascript and run it

### For Windows Users
1. Install [Chocolatey Package Manager](https://chocolatey.org/install)
2. Install make package (to be able to run `make` commands): `choco install make`
3. Set the *.env* file and the *compose.env* file similar to the *.env.example* file. See [Enviromnet Varibles](https://github.com/guimassoqueto/node-api-clean-architecture#environment-variables)
* To run the app fully containerized (skip steps 3, 4, and 5 in this case): `make up`
4. `make install` to install all package.json dependencies
5. Choose between:  
-- `make start-ts` to run the application without transpile the code to javascript  
-- `make start-js` to transpile the code to javascript and run it

## Environment Variables

**PS**: `MONGO_HOST` must be `mongodb`  in *compose.env*  
**PS**: `MONGO_URL` ***must not*** be defined in *compose.env*   
**PS**: If you change any variable in *.env*, change to the same value in *compose.env*, except for the two variables above  

|     VARIABLE           |DEFAULT VALUE                          |DEFINITION                         | REQUIRED|
|----------------|-------------------------------|-----------------------------|----|
|`ENVIRONMENT`|`dev`            |environment in which the app is running (necessary to run logs properly)           |:heavy_multiplication_x:|
|`AWS_SES_REGION`|`""`            |AWS SES's region           |:heavy_check_mark:|
|`AWS_SES_ACCESS_KEY_SECRET`|`""`            |AWS SES's Access Key Secret          |:heavy_check_mark:|
|`AWS_SES_ACCESS_KEY_ID`|`""`            |AWS SES's Access Key ID            |:heavy_check_mark:|
|`MONGO_ROOT_USERNAME`|`username`            |mongo user            |:heavy_check_mark:|
|`MONGO_ROOT_PASSWORD`          |`password`            |mongo password            |:heavy_check_mark:|
|`MONGO_HOST`         |`localhost`|mongo ip|:heavy_check_mark:|
|`MONGO_PORT`|`27017`            |port where mongo is listening            |:heavy_check_mark:|
|`APP_HOST`|`localhost`            |API's host           |:heavy_multiplication_x:|
|`APP_PORT`|`8000`            |API's port            |:heavy_multiplication_x:|
|`APP_URL`|`${APP_HOST}:${APP_PORT}"`            |API's URL            |:heavy_multiplication_x:|
|`JWT_SECRET`|`secret`            |Private Secret for jwt            |:heavy_multiplication_x:|
|`SALT_ROUNDS`|`12`            |number of rounds for encryption            |:heavy_multiplication_x:|
|`MONGO_URL`|`""`            |mongo url (for remote mongo)           |:heavy_multiplication_x:|


### Additional Commands (see [Makefile](Makefile))
* `make install`: install all package.json dependencies (including devDependencies)
* `make down`: stops containers and removes containers, networks, volumes, and images created
* `make test`: run all tests (unit, integration, and end-to-end)
* `make unit-test`: run all the unit tests
* `make integration-test`: run all the integration tests
* `make coverage-report`: show the test coverage of the app (first run `make test` or `make unit-test` or `make integration-test`)
* `make build`: transpile the typescript code located in *src/* to javascript (will be located in *dist/*)
* `make build-image`: build the application image using Docker
* `make tsc-watch`: transpile in real-time the code to javascript
* `make node-watch`: execute the app with changes in real-time (works with tsc-watch)


TODO:
- [x] Create an Email interface to handle emails, for validations, password recovery, etc [AWS SES]
- [x] Create an Adpater that implements Email interface and send emails. The Adapter should Implement an email service, like [Sendgrid](https://www.npmjs.com/package/@sendgrid/mail) or [Nodemailer](https://www.npmjs.com/package/nodemailer)
- [x] UML Structure - Class Diagram
- [x] UML Behavior - Use Case Diagram
- [x] UML Interaction - Sequence Diagram
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
- [ ] Define whether JWT_SECRET and SALT_ROUNDS should be defined in settings.ts should be raw written in the code, or be migrated to *.env*
