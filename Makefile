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

# executa teste de um arquivo especifico
test-file:
	${PACKAGE_MANAGER_RUN} test -- <relative_path_to_test_file>