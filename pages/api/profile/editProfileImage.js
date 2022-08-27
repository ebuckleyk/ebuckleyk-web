import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';
import { getAuth0ManagementClient } from '../../../utils/api/handlers/auth0';
import withCaptchaValidation from '../../../utils/api/middleware/withCaptchaValidation';
import { withApplicationInsights } from '../../../utils/api/middleware';

async function handler(req, res) {
  try {
    const { user } = getSession(req, res);

    switch (req.method) {
      case 'POST': {
        const profileImageUrl = req.body.profileUrl;
        if (!profileImageUrl) throw Error('No profile image url received.');

        const client = await getAuth0ManagementClient('update:users');

        await client.updateUserMetadata(
          { id: user.sub },
          {
            profileImageUrl
          }
        );
        break;
      }
      default:
        throw new Error(`${req.method} not supported.`);
    }
    res.status(200).json({ success: true });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ error: 'An error occurred.', message: err.message });
  }
}

export default withApplicationInsights(
  withApiAuthRequired(withCorrelationId(withCaptchaValidation(handler)))
);
