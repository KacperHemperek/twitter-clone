import { NextRequest } from 'next/server';

import { getTweetDetailsController } from './(controllers)/getTweetDetails';
import { editTweetController } from '@/app/api/tweets/[postId]/(controllers)/editTweet';

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

export async function PATCH(
  req: NextRequest,
  params: { params: TweetDetailsParams }
) {
  return apiHandler(editTweetController, req, params);
}
