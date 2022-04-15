import { withSentry } from '@sentry/nextjs';
import { getBlogById } from '../../../utils/api/handlers/contentful';
import logger from '../../../utils/logger';

async function handler(req, res) {
  const { id } = req.query;
  try {
    const data = await getBlogById(id);
    res.status(200).json(data);
  } catch (e) {
    logger.error({
      error: e,
      handler: '/api/blogs/[id]',
      params: { id },
      method: req.method
    });
    res.status(400).json({ error: 'An error occurred', message: e });
  }
}

export default withSentry(handler);
