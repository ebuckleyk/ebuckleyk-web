import { getAllBlogs } from '../../../utils/api/handlers/contentful';
import { getMyTwitterData } from '../../../utils/api/handlers/twitter';

function mergeData(data = []) {
  return data.sort((a, b) => b.date - a.date);
}

export default async function handler(req, res) {
  try {
    const twitterData = await getMyTwitterData();
    const contentfulData = await getAllBlogs();

    res.status(200).json(mergeData([...twitterData, ...contentfulData]));
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'An error occurred.', message: error });
  }
}
