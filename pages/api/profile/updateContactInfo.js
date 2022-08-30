import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';
import {
  getAuth0ManagementClient,
  getCuratedProfile
} from '../../../utils/api/handlers/auth0';
import withCaptchaValidation from '../../../utils/api/middleware/withCaptchaValidation';
import { withApplicationInsights } from '../../../utils/api/middleware';

async function PUT(body, userId) {
  const { addr1, addr2, city, state, zip, phone } = body;
  const client = await getAuth0ManagementClient('update:users');
  const response = await client.updateUserMetadata(
    { id: userId },
    {
      contact: {
        address: addr1,
        address2: addr2,
        city,
        state,
        zip,
        phone
      }
    }
  );
  return getCuratedProfile(response);
}

async function handler(req, res) {
  try {
    if (req.method !== 'PUT') throw new Error(`${req.method} not supported.`);
    const {
      user: { sub }
    } = getSession(req, res);

    const result = await PUT(req.body, sub);
    res.status(200).json(result);
  } catch (err) {
    logger.error(err);
    res.status(400).json({ error: 'An error occurred.', message: err.message });
  }
}

export default withApplicationInsights(
  withApiAuthRequired(withCorrelationId(withCaptchaValidation(handler)))
);
