PACKAGE_MANAGER=npm
PACKAGE_MANAGER_RUN=npm run
COMPOSE=docker compose
DOCKER=docker
REMOVE_FOLDER_RECURSIVE=rm -rf
COMPILED_CODE_FOLDER=dist/
REMOVE_DIST_FOLDER=${REMOVE_FOLDER_RECURSIVE} ${COMPILED_CODE_FOLDER}
DATABASE_UP=${COMPOSE} up mongodb -d
HUSKY=npx husky install
COPY_ENV_EXAMPLE=cat .env.example 1> .env && echo "MONGO_HOST=\"localhost\"" 1>> .env && cat .env.example 1> compose.env && echo "MONGO_HOST=\"mongodb\"" 1>> compose.env
DIR=xdg-open

# executa a aplicação containerizada, banco de dados e api
up:
	make down && ${COMPOSE} up -d

# inicia o container do banco de dados principal (mongodb)
# o husky depende desse commando no pre-commit, se mudá-lo, modifique-o tambem em .husk/pre-commit
db:
	${DATABASE_UP}

# derruba os containeres em execução, banco de dados e api
down:
	${COMPOSE} down

env:
	${COPY_ENV_EXAMPLE}

## instala todos os pacotes requeridos no package.json
i:
	${HUSKY} && ${PACKAGE_MANAGER} install

# executa todos os testes da aplicação, verborragicamente, sequencialmente, um a um
test:
	${DATABASE_UP} && ${PACKAGE_MANAGER_RUN} test

# executa os testes de modo simplificado
test-simple:
	${DATABASE_UP} && ${PACKAGE_MANAGER_RUN} test:simplified

# transpila para javascript
build:
	${REMOVE_DIST_FOLDER} && ${PACKAGE_MANAGER_RUN} build

# builda a imagem em docker
build-image:
	${DOCKER} build -t guimassoqueto/node-api .

# roda a aplicação em modo debug (precisa ser transpilado para js primeiro)
debug: 
	make build && ${PACKAGE_MANAGER_RUN} debug

# abre o navegador e mostra a cobertura dos testes
coverage-report:
	${BROWSER} -url "file://$(CURDIR)/coverage/lcov-report/index.html"

# executa testes unitários da aplicação, localizados em tests/unit
unit-test:
	${PACKAGE_MANAGER_RUN} test:unit

# executa testes de integração da aplicação, localizados em tests/integration
int-test:
	${DATABASE_UP} && ${PACKAGE_MANAGER_RUN} test:integration

# abre o navegador na página principal do repositório no GitHub 
or:
	open "https://github.com/guimassoqueto/node-clean-api"

# abre com a GUI o diretorio local do repositório
od:
	${DIR} .

# executa teste de um arquivo especifico
test-file:
	${PACKAGE_MANAGER_RUN} test -- tests/unit/infra.crypto.jwt-adapter.spec.ts

# faz a transpilação de tsc para javascript em tempo real, execute em um terminal separado
tsc-watch:
	${PACKAGE_MANAGER_RUN} tsc:watch

# executa a applicação em javascript com as mudanças feitas em tempo real, depende do tsc-watch estar em execução
# deve ser executado em terminal separado, diferente do terminal no qual tsc-watch está sendo executado
node-watch:
	${PACKAGE_MANAGER_RUN} node:watch

# builda e inicia a aplicação em javascript puro
start-js:
	make down && ${DATABASE_UP} && ${REMOVE_DIST_FOLDER} && ${PACKAGE_MANAGER_RUN} build && ${PACKAGE_MANAGER_RUN} start:server

# inicia a aplicação localmente sem transpilar
start-ts:
	make down && ${DATABASE_UP} && ${PACKAGE_MANAGER_RUN} start:local