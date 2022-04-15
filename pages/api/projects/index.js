import { getAllProjects } from '../../../utils/api/handlers/contentful';

export default async function handler(req, res) {
  try {
    const projects = await getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'An error occurred.', message: error });
  }
}
