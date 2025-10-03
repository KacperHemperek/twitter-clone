import { s3Client } from '@/utils/s3';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

import { ServerError } from '@/lib/server';

const BUCKET = process.env.AWS_S3_BUCKET_NAME || 'twitter-khemperek';

export async function getImage(path: string) {
  try {
    const getObjCommand = new GetObjectCommand({
      Bucket: BUCKET,
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

export async function getBufferFromURL(
  url: string
): Promise<Buffer | undefined> {
  const response = await fetch(url);
  const blob = await response.blob();
  const arrBuff = await blob.arrayBuffer();
  return Buffer.from(arrBuff);
}

export async function uploadImage(
  path: string,
  image: string,
  type: string
): Promise<string> {
  try {
    const buffer = await getBufferFromURL(image);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: path,
        Body: buffer,
        ContentType: type,
      })
    );
    const url = `${process.env.NEXTAUTH_URL}/api/images/${path}`;

    return url;
  } catch (error) {
    throw new ServerError({
      code: 500,
      message: `Something went wrong when uploading image ${path}`,
    });
  }
}
