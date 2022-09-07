import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import { log } from 'next-axiom';
import { getAuth0ManagementClient } from '../../../utils/api/handlers/auth0';
import withCaptchaValidation from '../../../utils/api/middleware/withCaptchaValidation';
import { withApplicationInsights } from '../../../utils/api/middleware';

async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST': {
        const { user } = getSession(req, res);
        const bio = req.body.bio ?? ' ';

        const client = await getAuth0ManagementClient('update:users');

        await client.updateUserMetadata(
          { id: user.sub },
          {
            bio
          }
        );
        break;
      }
      default:
        throw new Error(`${req.method} not supported.`);
    }

    res.status(200).json({ success: true });
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
