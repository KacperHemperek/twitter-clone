import { TweetDetailsParams } from '@/app/api/tweets/[postId]/route';
import { authOptions } from '@/utils/next-auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import {
  dislikeTweet,
  getLikeByTweetIdAndUserId,
  likeTweet,
} from '../(services)/like.service';

import { ServerError } from '@/lib/serverError';

export async function likeTweetController(
  req: NextRequest,
  params: TweetDetailsParams
) {
  const { postId: tweetId } = params;

  const session = await getServerSession(authOptions);

  const userId = session?.user.id;

  if (!userId) {
    throw new ServerError({
      code: 403,
      message: 'User must be logged in to perform that action',
    });
  }

  const like = await getLikeByTweetIdAndUserId(tweetId, userId);

  if (!!like) {
    await dislikeTweet(like.id);
  } else {
    await likeTweet(userId, tweetId);
  }

  return NextResponse.json({
    message: !!like ? 'disliked successfuly' : 'liked successfuly',
  });
}
