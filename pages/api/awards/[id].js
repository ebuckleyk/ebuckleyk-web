import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import web_public_api from '../../../utils/api';
import { withApplicationInsights } from '../../../utils/api/middleware';
import withCaptchaValidation from '../../../utils/api/middleware/withCaptchaValidation';
import withCorrelationId from '../../../utils/api/middleware/withCorrelationId';
import logger from '../../../utils/logger';

const PUT = async (formData, userId) => {
  const {
    applicationId,
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
  const dbApplication = await web_public_api(
    `/application-public?id=${applicationId}&userId=${userId}`
  );
  const updateApplication = {
    applicationId,
    campaignId: dbApplication.campaign_id,
    form: rest,
    contact_info: {
      ...dbApplication.contact_info,
      addr: addr1,
      addr2,
      city,
      state,
      zip,
      phone
    },
    docs: attachments.map((a) => {
      if (!a._id)
        return {
          ...a,
          path: `${process.env.S3_BUCKET}/${a.path}`,
          fileType: a.type
        };
      return a;
    })
  };

  const result = await web_public_api('/application-public', {
    method: 'PUT',
    body: updateApplication
  });
  return result;
};

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
      zip,
      phone
    },
    docs: attachments.map((a) => ({
      ...a,
      path: `${process.env.S3_BUCKET}/${a.path}`,
      fileType: a.type
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
      case 'PUT': {
        response = await PUT(req.body, user.sub);
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

export default withApplicationInsights(
  withApiAuthRequired(withCorrelationId(withCaptchaValidation(handler)))
);
