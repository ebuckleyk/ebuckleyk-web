import needle from 'needle';
import logger from '../../logger';
import settings from '../../../app.settings.json';

export async function validateCaptcha(captcha) {
  try {
    const response = await needle(
      'post',
      settings.api.reCaptchaApi,
      `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        }
      }
    );
    logger.info('Received response from recaptchaApi');
    return response.body.success;
  } catch (error) {
    logger.error(error);
    throw new Error('Request to validate captcha failed');
  }
}
