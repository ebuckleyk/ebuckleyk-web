import { withSentry } from '@sentry/nextjs';
import * as api from '../../../utils/api/handlers/sendgrid';
import logger from '../../../utils/logger';

async function handler(req, res) {
  if (req.method !== 'POST') return;

  try {
    await api.sendContactEmail(
      req.body.inqType,
      req.body.name,
      req.body.email,
      req.body.message
    );

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error({ error, route: '/api/contact', method: req.method });
    res.status(400).json({ error: 'An error occurred??', message: error });
  }
}

export default withSentry(handler);
