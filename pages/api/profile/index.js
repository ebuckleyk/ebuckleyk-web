import { withSentry } from '@sentry/nextjs';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import requestLogger from '../../../utils/api/middleware/requestLogger';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';
import {
  getAuth0ManagementClient,
  getCuratedProfile,
  getCuratedRoles
} from '../../../utils/api/handlers/auth0';

async function GET(userId) {
  const client = await getAuth0ManagementClient('read:users read:roles');

  const [roles, user] = await Promise.all([
    client.getUserRoles({ id: userId }),
    client.getUser({ id: userId })
  ]);

  const profile = getCuratedProfile(user);
  const userRoles = getCuratedRoles(roles);
  return { ...profile, roles: userRoles };
}

async function handler(req, res) {
  try {
    if (req.method !== 'GET') throw new Error(`${req.method} not supported.`);
    const {
      user: { sub }
    } = getSession(req, res);

    const result = await GET(sub);

    res.status(200).json(result);
  } catch (err) {
    logger.error(err);
    res.status(400).json({ error: 'An error occurred.', message: err.message });
  }
}

export default withSentry(
  withApiAuthRequired(withCorrelationId(requestLogger(handler)))
);
