import { ImageService } from '@/server/services/image.service';

import { NextRequest } from 'next/server';

export async function getImageController(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { path } = params;
  const imagePath = path.join('/');

  const { buffer, contentType } = await ImageService.getImage(imagePath);

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType ?? 'image/jpeg',
    },
  });
}
