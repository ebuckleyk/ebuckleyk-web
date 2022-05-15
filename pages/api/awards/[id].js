import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import web_public_api from '../../../utils/api';
import requestLogger from '../../../utils/api/middleware/requestLogger';
import withCaptchaValidation from '../../../utils/api/middleware/withCaptchaValidation';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';

const POST = async (formData, userId) => {
  const {
    campaignId,
    addr1,
    addr2,
    appType,
    attachments = [],
    captcha,
    city,
    email,
    first_name,
    last_name,
    phone,
    state,
    zip,
    ...rest
  } = formData;
  const newApplication = {
    campaignId: campaignId,
    form: rest,
    contact_info: {
      name: `${first_name} ${last_name}`,
      addr: addr1,
      addr2,
      city,
      state,
      zip
    },
    docs: attachments.map((a) => ({
      name: a.name,
      path: `${process.env.S3_BUCKET}/${a.hostedContent}`
    })),
    applicant: {
      auth0Id: userId,
      name: `${first_name} ${last_name}`
    }
  };
  const result = await web_public_api('/application-public', {
    method: 'POST',
    body: newApplication
  });

  return result;
};
async function handler(req, res) {
  try {
    let response = null;
    const { user } = getSession(req, res);
    switch (req.method) {
      case 'POST': {
        response = await POST(req.body, user.sub);
        break;
      }
      default:
        throw new Error(`${req.method} method not allowed`);
    }
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: 'An error occurred.', message: error });
  }
}

export default withApiAuthRequired(
  withCorrelationId(requestLogger(withCaptchaValidation(handler)))
);
