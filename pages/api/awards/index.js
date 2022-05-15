import requestLogger from '../../../utils/api/middleware/requestLogger';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';
import web_public_api from '../../../utils/api';

async function handler(req, res) {
  try {
    const awards = await web_public_api('/award-public');
    res.status(200).json(awards);
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: 'An error occurred.', message: error });
  }
}

export default withCorrelationId(requestLogger(handler));
