import { withSentry } from '@sentry/nextjs';
import requestLogger from '../../../utils/api/middleware/requestLogger';
import withCaptchaValidation from '../../../utils/api/middleware/withCaptchaValidation';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';

async function handler(req, res) {
  try {
    if (req.method !== 'POST')
      throw new Error(`${req.method} method not allowed.`);

    res.status(200).json(req.body);
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: 'An error occurred.', message: error });
  }
}

export default withSentry(
  withCorrelationId(requestLogger(withCaptchaValidation(handler)))
);
