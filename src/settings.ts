import dotenv from 'dotenv'
dotenv.config()

const MONGO_ROOT_USERNAME = process.env.MONGO_ROOT_USERNAME ?? 'username'
const MONGO_ROOT_PASSWORD = process.env.MONGO_ROOT_PASSWORD ?? 'password'
const MONGO_HOST = process.env.MONGO_HOST ?? '0.0.0.0'
const MONGO_PORT = process.env.MONGO_PORT ?? '27017'
export const APP_PORT = parseInt(process.env.APP_PORT ?? '8000')

export const JWT_SECRET = 'k123!@#-15_}{' // secredo usado para encriptar senhas e dados sigilosos
export const SALT_ROUNDS = 12 // número de interaçoes na qual o segredo será aplicado no algoritmo de geração da hash. Recomenda-se qualquer valor acima de 10

const MONGO_DB_NAME = process.env.MONGO_DB_NAME ?? 'node-clean-api'
export const MONGO_URL = process.env.MONGO_URL ?? `mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`
