import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import { log } from 'next-axiom';
import web_public_api from '../../../utils/api';
import { withApplicationInsights } from '../../../utils/api/middleware';

async function handler(req, res) {
  try {
    const awards = await web_public_api('/award-public');
    res.status(200).json(awards);
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
