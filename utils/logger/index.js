import pino from 'pino';
import { logflarePinoVercel } from 'pino-logflare';

// create pino-logflare console for serverless functions and send function for browser logs

const { stream, send } = logflarePinoVercel({
  apiKey: process.env.LOGFLARE_APIKEY,
  sourceToken: process.env.LOGFLARE_SOURCETOKEN
});

// create pino logger
const pino_logger = pino(
  {
    browser: {
      transmit: {
        level: 'info',
        send
      }
    },
    level: 'debug',
    base: {
      env: process.env.NODE_ENV,
      revision: process.env.VERCEL_GIT_COMMIT_SHA
    }
  },
  stream
);

const info = (message, ...args) => {
  pino_logger.info({ message, ...args });
  console.info({ message, ...args });
};

const error = (message, ...args) => {
  pino_logger.error({ message, ...args });
  console.error({ message, ...args });
};

const extractReqInfo = (req) => {
  if (!req) return '';
  return `${req.method} - ${req.url}`;
};

const logger = {
  info,
  error,
  helper: {
    extractReqInfo
  }
};

export default logger;
