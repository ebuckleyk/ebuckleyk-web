import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';
import { withApplicationInsights } from '../../../utils/api/middleware';
import web_public_api from '../../../utils/api';

async function GET(userId) {
  const applications = await web_public_api(
    `/application-public?userId=${userId}`
  );
  return applications;
}

async function handler(req, res) {
  try {
    const {
      user: { sub }
    } = getSession(req, res);
    let result = null;

    switch (req.method) {
      case 'GET': {
        result = await GET(sub);
        break;
      }
      default:
        throw new Error(`${req.method} not supported.`);
    }

    res.status(200).json(result);
  } catch (err) {
    logger.error(err);
    res.status(400).json({ error: 'An error occurred.', message: err.message });
  }
}

export default withApplicationInsights(
  withApiAuthRequired(withCorrelationId(handler))
);
