const MONGO_ROOT_USERNAME = 'username'
const MONGO_ROOT_PASSWORD = 'password'
const MONGO_HOST = '0.0.0.0'
const MONGO_PORT = '27017'
const MONGO_DB_NAME = "node-clean-api-test"

export const JWT_SECRET = 'secret'
export const SALT_ROUNDS = 12

export const MONGO_URL = `mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`
