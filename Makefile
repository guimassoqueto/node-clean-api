PACKAGE_MANAGER_RUN=npm run
BROWSER=firefox

# executa todos os testes da aplicação, verborragicamente, sequencialmente, um a um
test:
	${PACKAGE_MANAGER_RUN} test

# abre o navegador e mostra a cobertura dos testes
test-coverage-report:
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

test-password-validator:
	${PACKAGE_MANAGER_RUN} test -- tests/unit/password-validator-adapter.spec.ts