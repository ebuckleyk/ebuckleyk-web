import { log } from 'next-axiom';
import { validateCaptcha } from '../handlers/recaptcha';

const withCaptchaValidation = (handler) => async (req, res) => {
  try {
    if (!req.body.captcha) throw new Error('Captcha is missing. No spam!!');

    const isValid = await validateCaptcha(req.body.captcha);
    if (!isValid) throw new Error('Captcha is incorrect.');
    return handler(req, res);
  } catch (error) {
    log.error(error);
    res.status(400).send({ error: 'An error occurred.' });
  }
};

export default withCaptchaValidation;
