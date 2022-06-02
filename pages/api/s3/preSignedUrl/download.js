import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { withApplicationInsights } from '../../../../utils/api/middleware';
import withCorrelationId from '../../../../utils/api/middleware/withCorrelationId';
import logger from '../../../../utils/logger';

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  },
  region: 'us-east-1'
});

async function handler(req, res) {
  try {
    const { filePath } = req.query;

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: filePath.replace(`${process.env.S3_BUCKET}/`, '')
    });
    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: process.env.S3_PRESIGNED_LIFETIME
    });

    res.status(200).json({ signedUrl });
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: 'An error occurred.', message: error });
  }
}

export default withApplicationInsights(
  withApiAuthRequired(withCorrelationId(handler))
);
