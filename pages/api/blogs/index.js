import { getAllBlogs } from '../../../utils/api/handlers/contentful';
import { getMyTwitterData } from '../../../utils/api/handlers/twitter';
import { log } from 'next-axiom';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import { withApplicationInsights } from '../../../utils/api/middleware';

function mergeData(data = []) {
  return data.sort((a, b) => b.date - a.date);
}

async function handler(req, res) {
  try {
    const twitterData = await getMyTwitterData();
    const contentfulData = await getAllBlogs();
    res.status(200).json(mergeData([...twitterData, ...contentfulData]));
  } catch (error) {
    const correlationId = res.getHeader('x-requestId');
    log.error(error.message, {
      ...(req.query ?? {}),
      ...(req.body ?? {}),
      correlationId
    });
    res
      .status(400)
      .json({ error: 'An error occurred.', requestId: correlationId });
  }
}

export default withApplicationInsights(withCorrelationId(handler));
