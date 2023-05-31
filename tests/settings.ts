import dotenv from 'dotenv'
dotenv.config()

const MONGO_ROOT_USERNAME = 'user'
const MONGO_ROOT_PASSWORD = 'pwd'
const MONGO_HOST = '0.0.0.0'
const MONGO_PORT = '27017'
const MONGO_DB_NAME = 'node-clean-api'

export const JWT_SECRET = process.env.JWT_SECRET ?? 'secret'
export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? '12')

export const ENVIRONMENT = 'dev'
export const MONGO_URL = `mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`
