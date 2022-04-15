import pino from 'pino';
import { logflarePinoVercel } from 'pino-logflare';

// create pino-logflare console for serverless functions and send function for browser logs

const { stream, send } = logflarePinoVercel({
  apiKey: '',
  sourceToken: ''
});

// create pino logger
export default pino(
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
      revision: process.env.VERCEL_GITHUB_COMMIT_SHA
    }
  },
  stream
);
