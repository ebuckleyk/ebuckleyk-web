import * as api from '../../../utils/api/handlers/sendgrid';
import { withApplicationInsights } from '../../../utils/api/middleware';
import withCaptchaValidation from '../../../utils/api/middleware/withCaptchaValidation';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';

async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST': {
        await api.sendContactEmail(
          req.body.inqType,
          req.body.name,
          req.body.email,
          req.body.message,
          req.body.phone
        );
        break;
      }
      default:
        throw new Error('Methodn not supported. ');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res
      .status(400)
      .json({ error: 'An error occurred.', message: error.message });
  }
}

export default withApplicationInsights(
  withCorrelationId(withCaptchaValidation(handler))
);
