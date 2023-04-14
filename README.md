# node-api-clean-architecture

## Requirements (for all users)
* [Node 19+](https://nodejs.org/en)
* [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/)

## Running the application locally

### For Linux (Debian) Users
1. Install buid-essential package (to be able to run `make` commands): `sudo apt-get install build-essential`
2. Rename the *.env.example* to *.env*
3. `make mongodb` to up the mongo container
4. `make start-server` to run the application

### For Windows Users
1. Install [Chocolatey Package Manager](https://chocolatey.org/install)
2. Install make package (to be able to run `make` commands): `choco install make`
3. Rename the *.env.example* to *.env*
4. `make start-server` to run the application


TODO:
- [ ] UML Class Diagram
- [ ] UML Use Case Diagram
- [x] Add dependabot
- [x] Add Github Actions Pipeline
- [ ] Add MongoDb in Github Actions to run integration tests
- [ ] Add Performance test reports using [K6](https://k6.io/)
- [ ] Create Kubernetes files to allow the application to run in pods
- [ ] Deploy the application in AWS EKS or GCP Kubernetes Engine
- [ ] Integrate the application with [Grafana](https://grafana.com/)
- [x] Evaluate whether tests should have their own settings.ts
- [ ] Add a logging library to manage application logs. See [Winston](https://www.npmjs.com/package/winston)
- [ ] Add diagram for LoginController
