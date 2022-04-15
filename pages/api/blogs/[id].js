import { getBlogById } from '../../../utils/api/handlers/contentful';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const data = await getBlogById(id);
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'An error occurred', message: e });
  }
}
