PACKAGE_MANAGER_RUN=npm run
BROWSER=firefox

test:
	${PACKAGE_MANAGER_RUN} test

test-coverage-report:
	${BROWSER} -url "file://$(CURDIR)/coverage/lcov-report/index.html"

unit-test:
	${PACKAGE_MANAGER_RUN} test:unit

integration-test:
	${PACKAGE_MANAGER_RUN} test:integration

open-repo:
	${BROWSER} -url "https://github.com/guimassoqueto/node-api-clean-architecture"

