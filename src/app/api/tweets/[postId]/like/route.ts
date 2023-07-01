import { NextRequest } from 'next/server';

import { likeTweetController } from './(controllers)/likeTweetController';

export async function POST(
  _: NextRequest,
  {
    params,
  }: {
    params: { postId: string };
  }
) {
  return likeTweetController(params.postId);
}
