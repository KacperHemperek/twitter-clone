import { s3Client } from '@/utils/s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest } from 'next/server';

import { ServerError } from '@/lib/server';

export async function getImageController(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { path } = params;
  const getObjCommand = new GetObjectCommand({
    Bucket: 'twitter-khemperek',
    Key: path.join('/'),
  });

  let body: Uint8Array | undefined;
  try {
    const response = await s3Client.send(getObjCommand);
    body = await response.Body?.transformToByteArray();
  } catch (error) {
    throw new ServerError({
      code: 404,
      message: `Image ${path.join('/')} not found`,
    });
  }

  if (!body) {
    throw new ServerError({
      code: 404,
      message: `Image ${path.join('/')} not found`,
    });
  }

  const buffer = Buffer.from(body);

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });
}
