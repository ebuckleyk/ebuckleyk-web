import pino from 'pino';
import { logflarePinoVercel } from 'pino-logflare';

// create pino-logflare console for serverless functions and send function for browser logs

const { stream, send } = logflarePinoVercel({
  apiKey: process.env.LOGFLARE_APIKEY,
  sourceToken: process.env.LOGFLARE_SOURCETOKEN
});

// create pino logger
const logger = pino(
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

export default logger;
