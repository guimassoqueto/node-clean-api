import dotenv from 'dotenv'
dotenv.config()

const MONGO_ROOT_USERNAME = process.env.MONGO_ROOT_USERNAME ?? 'username'
const MONGO_ROOT_PASSWORD = process.env.MONGO_ROOT_PASSWORD ?? 'password'
const MONGO_HOST = process.env.MONGO_HOST ?? '0.0.0.0'
const MONGO_PORT = process.env.MONGO_PORT ?? '27017'
export const APP_PORT = parseInt(process.env.APP_PORT ?? '8000')

// stg == test environment
const MONGO_DB_NAME_STG = process.env.MONGO_DB_NAME_STG ?? 'test'
export const MONGO_URL_STG = `mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME_STG}?authSource=admin`

// prod
const MONGO_DB_NAME_PROD = process.env.MONGO_DB_NAME_PROD ?? 'test'
export const MONGO_URL_PROD = `mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME_PROD}?authSource=admin`
