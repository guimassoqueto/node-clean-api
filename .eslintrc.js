module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    "@typescript-eslint/restrict-template-expressions": "off", // if you remove this live eslint will throw an error related to file src/logger.ts
    "@typescript-eslint/consistent-type-definitions": "off"
  }
}
