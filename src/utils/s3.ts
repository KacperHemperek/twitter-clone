import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';

const config: S3ClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: 'eu-central-1',
};

export const s3Client = new S3Client(config);
