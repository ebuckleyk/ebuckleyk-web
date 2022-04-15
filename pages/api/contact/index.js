import * as api from '../../../utils/api/handlers/sendgrid';
export default async function handler(req, res) {
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
    console.error(error);
    res.status(400).json({ error: 'An error occurred??', message: error });
  }
}
