import config from "./jest.config";

const { testMatch, ...rest } = config;

export default {
  testMatch: [ "**/unit/*.(spec|test).ts" ],
  ...rest
}