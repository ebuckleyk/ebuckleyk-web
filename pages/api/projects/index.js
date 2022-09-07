import { log } from 'next-axiom';
import { getAllProjects } from '../../../utils/api/handlers/contentful';
import withApplicationInsights from '../../../utils/api/middleware/withApplicationInsights';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';

async function handler(req, res) {
  try {
    const projects = await getAllProjects();
    res.status(200).json(projects);
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
