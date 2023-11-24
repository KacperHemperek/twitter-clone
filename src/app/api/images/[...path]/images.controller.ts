import { NextRequest } from 'next/server';

import { getImage } from '@/app/api/images/[...path]/images.services';

export async function getImageController(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { path } = params;
  const imagePath = path.join('/');

  const { buffer, contentType } = await getImage(imagePath);

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType ?? 'image/jpeg',
    },
  });
}
