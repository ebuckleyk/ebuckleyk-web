import { withSentry } from '@sentry/nextjs';
import { getAllBlogs } from '../../../utils/api/handlers/contentful';
import { getMyTwitterData } from '../../../utils/api/handlers/twitter';
import logger from '../../../utils/logger';

function mergeData(data = []) {
  return data.sort((a, b) => b.date - a.date);
}

async function handler(req, res) {
  try {
    const twitterData = await getMyTwitterData();
    const contentfulData = await getAllBlogs();
    logger.info('Retrieved blog data successfully');
    res.status(200).json(mergeData([...twitterData, ...contentfulData]));
  } catch (error) {
    logger.error({ error, handler: '/api/blogs', method: req.method });
    res.status(400).json({ error: 'An error occurred.', message: error });
  }
}

export default withSentry(handler);
