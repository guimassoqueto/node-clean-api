import winston, { format, type Logger } from 'winston'
const { combine, timestamp, printf } = format

function makeLogger (): Logger {
  // formato da mensage no logger
  const messageFormat: winston.Logform.Format = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`
  })
  // formato da mensagem: https://github.com/taylorhakes/fecha
  const timestampFormat = { format: 'DD-MM-YYYY Z HH:mm:ss.SSS' }

  // TODO: Fazer level de acordo com a variavel de ambiente NODE_ENV
  const level: string = 'debug'

  return winston.createLogger({
    level,
    format: combine(
      timestamp(timestampFormat),
      messageFormat
    ),
    transports: [new winston.transports.Console()]
  })
}
const logger: Logger = makeLogger()
export default logger
