import sgMail from '@sendgrid/mail';
import settings from '../../../app.settings.json';
import { CONTACT_TYPE } from '../../constants';

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

const buildMessage = (inqType, name, message, emailAddress) => {
  return {
    subject:
      inqType === CONTACT_TYPE.GENERAL
        ? `[General Information Request] ${name}`
        : `[Consulting Interest] ${name}`,
    to: settings.social_media.email.url.replace('mailto:', ''),
    from: process.env.WEBSITE_FROM_ADDR,
    text: `${message}\n\n Contact Information: ${emailAddress}`,
    html: `<p>${message}</p><p><strong>Contact Information:</strong> ${emailAddress}</p>`
  };
};

export async function sendContactEmail(inqType, name, emailAddress, message) {
  const msg = buildMessage(inqType, name, message, emailAddress);
  try {
    await sgMail.send(msg);
  } catch (error) {
    // log error
    throw new Error('Problem sending email');
  }
}
