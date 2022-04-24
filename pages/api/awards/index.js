import { withSentry } from '@sentry/nextjs';
import { getallAwards } from '../../../utils/api/handlers/contentful';
import requestLogger from '../../../utils/api/middleware/requestLogger';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';

async function handler(req, res) {
  try {
    const awards = await getallAwards();
    res.status(200).json(awards);
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: 'An error occurred.', message: error });
  }
}

export default withSentry(withCorrelationId(requestLogger(handler)));
