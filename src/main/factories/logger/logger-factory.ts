import winston, { format, type Logger } from 'winston'
const { combine, timestamp, printf, label } = format

export default function loggerFactory (appLabel: string): Logger {
  // formato da mensage no logger
  const messageFormat: winston.Logform.Format = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}][${level}]: ${message}`
  })
  // formato da mensagem: https://github.com/taylorhakes/fecha
  const timestampFormat = { format: 'DD-MM-YYYY Z HH:mm:ss.SSS' }

  // TODO: Fazer level de acordo com a variavel de ambiente NODE_ENV
  const level: string = 'debug'

  return winston.createLogger({
    level,
    format: combine(
      label({ label: appLabel }),
      timestamp(timestampFormat),
      messageFormat
    ),
    transports: [new winston.transports.Console()]
  })
}
