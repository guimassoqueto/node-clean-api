import config from "./jest.config";

const { testMatch, ...rest } = config;

export default {
  testMatch: [ "**/integration/*.(spec|test).ts" ],
  ...rest
}