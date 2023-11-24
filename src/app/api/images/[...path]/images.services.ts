import { s3Client } from '@/utils/s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';

import { ServerError } from '@/lib/server';

export async function getImage(path: string) {
  try {
    const getObjCommand = new GetObjectCommand({
      Bucket: 'twitter-khemperek',
      Key: path,
    });

    const response = await s3Client.send(getObjCommand);
    const body = await response.Body?.transformToByteArray();

    if (!body) {
      throw new ServerError({
        code: 404,
        message: `Image ${path} not found`,
      });
    }

    const buffer = Buffer.from(body);
    return {
      buffer,
      contentType: response.ContentType,
    };
  } catch (error) {
    if (error instanceof ServerError) throw error;

    throw new ServerError({
      code: 500,
      message: `Something went wrong when getting image ${path}`,
    });
  }
}
