PACKAGE_MANAGER_RUN=npm run

test:
	${PACKAGE_MANAGER_RUN} test

test-coverage-report:
	firefox -url "file://$(CURDIR)/coverage/lcov-report/index.html"

unit-test:
	${PACKAGE_MANAGER_RUN} test:unit

integration-test:
	${PACKAGE_MANAGER_RUN} test:integration
