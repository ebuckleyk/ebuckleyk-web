import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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

const getBucketKey = (fileName, userId, prefix) => {
  return `${userId}/${prefix}/${fileName}`;
};

async function handler(req, res) {
  try {
    const { user } = getSession(req, res);
    const { fileName, prefix } = req.query;

    const key = getBucketKey(fileName, user.sub, prefix);
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key
    });
    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: process.env.S3_PRESIGNED_LIFETIME
    });
    res.status(200).json({ signedUrl, hostedContent: key, fileName });
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: 'An error occurred.', message: error });
  }
}

export default withApplicationInsights(
  withApiAuthRequired(withCorrelationId(handler))
);
