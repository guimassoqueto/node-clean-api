import { ENVIRONMENT } from './settings'
import winston, { format, type Logger } from 'winston'
const { combine, timestamp, printf, label } = format

export default function loggerConfig (appLabel: string): Logger {
  // formato da mensage no logger
  const messageFormat: winston.Logform.Format = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}][${level}]: ${message}`
  })
  // formato da mensagem: https://github.com/taylorhakes/fecha
  const timestampFormat = { format: 'DD-MM-YYYY Z HH:mm:ss.SSS' }

  // expressão regular que define qualquer frase que inicia com p, case-insensitive (P também é aceito)
  // independente de ENVIROMENT ser "prod", "production", "PRod", etc vai identificar que o ambiente é de
  // produção, pois inicia com a letra p
  const regex: RegExp = /^p/i

  let level: string
  if (regex.test(ENVIRONMENT)) {
    level = 'info'
  } else {
    level = 'debug'
  }

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
