import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import { log } from 'next-axiom';
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

export default withApplicationInsights(
  withApiAuthRequired(withCorrelationId(withCaptchaValidation(handler)))
);
