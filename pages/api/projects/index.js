import { withSentry } from '@sentry/nextjs';
import { getAllProjects } from '../../../utils/api/handlers/contentful';
import logger from '../../../utils/logger';

async function handler(req, res) {
  try {
    const projects = await getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    logger.error({ error, route: 'api/projects', method: req.method });
    res.status(400).json({ error: 'An error occurred.', message: error });
  }
}

export default withSentry(handler);
