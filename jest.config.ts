/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/main/**",
    "!<rootDir>/src/settings.ts",
    "!<rootDir>/src@src/logger-config.ts",
    "!<rootDir>/tests/settings.ts"
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
    "@tests/(.*)": "<rootDir>/tests/$1"
  },
  preset: "ts-jest",
  roots: [
    "<rootDir>/tests"
  ],
  testEnvironment: "jest-environment-node",
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
};
