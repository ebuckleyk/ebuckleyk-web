import { getAllProjects } from '../../../utils/api/handlers/contentful';
import withApplicationInsights from '../../../utils/api/middleware/withApplicationInsights';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';

async function handler(req, res) {
  try {
    const projects = await getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: 'An error occurred.', message: error });
  }
}

export default withApplicationInsights(withCorrelationId(handler));
