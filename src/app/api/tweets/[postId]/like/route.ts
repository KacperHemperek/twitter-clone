import { NextRequest } from 'next/server';

import { likeTweetController } from './(controllers)/likeTweetController';

import { apiHandler } from '@/lib/serverError';

export async function POST(
  req: NextRequest,
  params: {
    params: { postId: string };
  }
) {
  return apiHandler(likeTweetController, req, params);
}
