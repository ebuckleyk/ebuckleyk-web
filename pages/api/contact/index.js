import * as api from '../../../utils/api/handlers/sendgrid';
import requestLogger from '../../../utils/api/middleware/requestLogger';
import withCaptchaValidation from '../../../utils/api/middleware/withCaptchaValidation';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') throw new Error('Method not supported.');

    await api.sendContactEmail(
      req.body.inqType,
      req.body.name,
      req.body.email,
      req.body.message
    );
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res
      .status(400)
      .json({ error: 'An error occurred.', message: error.message });
  }
}

export default withCorrelationId(requestLogger(withCaptchaValidation(handler)));
