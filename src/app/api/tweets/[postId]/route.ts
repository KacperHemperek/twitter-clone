import { NextRequest } from 'next/server';

import { getTweetDetailsController } from './(controllers)/getTweetDetails';

import { apiHandler } from '@/lib/serverError';

export type TweetDetailsParams = { postId: string };

export async function GET(
  req: NextRequest,
  params: {
    params: TweetDetailsParams;
  }
) {
  return apiHandler(getTweetDetailsController, req, params);
}
