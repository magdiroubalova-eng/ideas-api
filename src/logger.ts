import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Never write sensitive values to the logs (tokens, cookies).
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
    ],
    censor: '[REDACTED]',
  },
  transport: process.env.NODE_ENV === 'production'
    ? undefined
    : { target: 'pino-pretty' },
});