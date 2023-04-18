# node-api-clean-architecture

## Requirements (for all users)
* [Node 19+](https://nodejs.org/en)
* [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/)

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
|`MONGO_ROOT_USERNAME`|`username`            |mongo user            |:heavy_check_mark:|
|`MONGO_ROOT_PASSWORD`          |`password`            |mongo password            |:heavy_check_mark:|
|`MONGO_HOST`         |`localhost`|mongo ip|:heavy_check_mark:|
|`MONGO_PORT`|`27017`            |port where mongo is listening            |:heavy_check_mark:|
|`APP_PORT`|`8000`            |api port            |:heavy_check_mark:|
|`MONGO_URL`|`""`            |mongo url (for remote mongo)           |:heavy_multiplication_x:|

### Additional Commands (see [Makefile](Makefile))
* `make install`: install all package.json dependencies (including devDependencies)
* `make down`: stops containers and removes containers, networks, volumes, and images created
* `make test`: run all tests (unit, integration, and end-to-end)
* `make unit-test`: run all the unit tests
* `make integration-test`: run all the integration tests
* `make coverage-report`: show the test coverage of the app (first run `make test` or `make unit-test` or `make integration-test`)
* `make build`: transpile the typescript code located in *src/* to javascript (will be located in *dist/*)



TODO:
- [ ] UML Class Diagram
- [ ] UML Use Case Diagram
- [x] Add dependabot
- [x] Add Github Actions Pipeline
- [ ] Add MongoDb in Github Actions to run integration tests
- [ ] Add Performance test reports using [K6](https://k6.io/)
- [x] Create Kubernetes files to allow the application to run in pods
- [ ] Deploy the application in AWS EKS or GCP Kubernetes Engine
- [ ] Integrate the application with [Grafana](https://grafana.com/)
- [x] Evaluate whether tests should have their own settings.ts
- [ ] Add a logging library to manage application logs. See [Winston](https://www.npmjs.com/package/winston)
- [ ] Add diagram for LoginController
- [ ] Define whether JWT_SECRET and SALT_ROUNDS should be defined in settings.ts should be raw written in the code, or be migrated to *.env*
