import { getTweetDetailsController } from './(controllers)/getTweetDetails';
import { deleteTweetController } from '@/app/api/tweets/[postId]/(controllers)/deleteTweet';
import { editTweetController } from '@/app/api/tweets/[postId]/(controllers)/editTweet';

import { apiHandler } from '@/lib/server';

import { NextRequest } from 'next/server';

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

export async function DELETE(
  req: NextRequest,
  params: { params: TweetDetailsParams }
) {
  return apiHandler(deleteTweetController, req, params);
}
