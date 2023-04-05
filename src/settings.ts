import dotenv from 'dotenv'
dotenv.config()

const MONGO_ROOT_USERNAME = process.env.MONGO_ROOT_USERNAME ?? 'username'
const MONGO_ROOT_PASSWORD = process.env.MONGO_ROOT_PASSWORD ?? 'password'
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME ?? 'test'
const MONGO_HOST = process.env.MONGO_HOST ?? '0.0.0.0'
const MONGO_PORT = process.env.MONGO_PORT ?? '27017'

export const APP_PORT = parseInt(process.env.APP_PORT ?? '8000')

export const MONGO_URL = `mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}?authSource=admin`
