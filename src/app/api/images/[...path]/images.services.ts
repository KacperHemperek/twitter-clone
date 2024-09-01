import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

import { NotFoundError, ServerError } from '@/lib/server';

import { s3Client } from '@/utils/s3';

export async function getImage(path: string) {
  const getObjCommand = new GetObjectCommand({
    Bucket: 'twitter-khemperek',
    Key: path,
  });

  const response = await s3Client.send(getObjCommand);
  const body = await response.Body?.transformToByteArray();

  if (!body) {
    throw new NotFoundError(`Image ${path} not found`);
  }

  const buffer = Buffer.from(body);
  return {
    buffer,
    contentType: response.ContentType,
  };
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
  const buffer = await getBufferFromURL(image);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: 'twitter-khemperek',
      Key: path,
      Body: buffer,
      ContentType: type,
    })
  );
  return `${process.env.NEXTAUTH_URL}/api/images/${path}`;
}
