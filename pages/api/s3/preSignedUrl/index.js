import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { log } from 'next-axiom';
import { withApplicationInsights } from '../../../../utils/api/middleware';
import withCorrelationId from '../../../../utils/api/middleware/withCorrelationId';

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  },
  region: 'us-east-1'
});

const getBucketKey = (fileName, prefix) => {
  return `${prefix}/${fileName}`;
};

async function handler(req, res) {
  try {
    let response = null;
    switch (req.method) {
      case 'GET': {
        const { user } = getSession(req, res);
        const { fileName, prefix } = req.query;

        const key = getBucketKey(fileName, prefix);
        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key
        });
        const signedUrl = await getSignedUrl(client, command, {
          expiresIn: process.env.S3_PRESIGNED_LIFETIME
        });
        response = { signedUrl, hostedContent: key, fileName };
        break;
      }
      default:
        throw new Error(`${req.method} not supported.`);
    }

    res.status(200).json(response);
  } catch (error) {
    const correlationId = res.getHeader('x-requestId');
    log.error(error.message, {
      ...(req.query ?? {}),
      ...(req.body ?? {}),
      correlationId
    });
    res
      .status(400)
      .json({ error: 'An error occurred.', requestId: correlationId });
  }
}

export default withApplicationInsights(
  withApiAuthRequired(withCorrelationId(handler))
);
