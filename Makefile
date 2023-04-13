PACKAGE_MANAGER_RUN=npm run
BROWSER=firefox
DOCKER=docker compose

# executa todos os testes da aplicação, verborragicamente, sequencialmente, um a um
test:
	${PACKAGE_MANAGER_RUN} test

# abre o navegador e mostra a cobertura dos testes
coverage-report:
	${BROWSER} -url "file://$(CURDIR)/coverage/lcov-report/index.html"

# executa testes unitários da aplicação, localizados em tests/unit
unit-test:
	${PACKAGE_MANAGER_RUN} test:unit

# executa testes de integração da aplicação, localizados em tests/integration
integration-test:
	${PACKAGE_MANAGER_RUN} test:integration

# abre o navegador na página principal do repositório no GitHub 
open-repo:
	${BROWSER} -url "https://github.com/guimassoqueto/node-api-clean-architecture"

# executa teste de um arquivo especifico
test-file:
	${PACKAGE_MANAGER_RUN} test -- tests/unit/infra.crypto.jwt-adapter.spec.ts

# inicia a aplicação localmente sem aguardar pela compilação
start-server:
	${PACKAGE_MANAGER_RUN} start:server

# inicia o mongodb localmente
mongodb:
	${DOCKER} up -d