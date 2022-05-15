import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import requestLogger from '../../../utils/api/middleware/requestLogger';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';
import { getAuth0ManagementClient } from '../../../utils/api/handlers/auth0';
import withCaptchaValidation from '../../../utils/api/middleware/withCaptchaValidation';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') throw new Error(`${req.method} not supported.`);

    const { user } = getSession(req, res);
    const bio = req.body.bio;

    const client = await getAuth0ManagementClient('update:users');

    await client.updateUserMetadata(
      { id: user.sub },
      {
        bio
      }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ error: 'An error occurred.', message: err.message });
  }
}

export default withApiAuthRequired(
  withCorrelationId(requestLogger(withCaptchaValidation(handler)))
);
