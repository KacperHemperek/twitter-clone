import { NextRequest } from 'next/server';

import { likeTweetController } from './(controllers)/likeTweetController';

import { apiHandler } from '@/lib/server';

export async function POST(
  req: NextRequest,
  params: {
    params: { postId: string };
  }
) {
  return apiHandler(likeTweetController, req, params);
}
