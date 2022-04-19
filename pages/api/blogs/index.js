import { withSentry } from '@sentry/nextjs';
import { getAllBlogs } from '../../../utils/api/handlers/contentful';
import { getMyTwitterData } from '../../../utils/api/handlers/twitter';
import logger from '../../../utils/logger';
import requestLogger from '../../../utils/api/middleware/requestLogger';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';

function mergeData(data = []) {
  return data.sort((a, b) => b.date - a.date);
}

async function handler(req, res) {
  try {
    const twitterData = await getMyTwitterData();
    const contentfulData = await getAllBlogs();
    res.status(200).json(mergeData([...twitterData, ...contentfulData]));
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: 'An error occurred.', message: error });
  }
}

export default withSentry(withCorrelationId(requestLogger(handler)));
