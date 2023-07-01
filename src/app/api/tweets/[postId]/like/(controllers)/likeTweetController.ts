import { authOptions } from '@/utils/next-auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import {
  dislikeTweet,
  getLikeByTweetIdAndUserId,
  likeTweet,
} from '../(services)/like.services';

import { handleServerError, nextServerErrorFactory } from '@/lib/serverError';

export async function likeTweetController(tweetId: string) {
  try {
    const session = await getServerSession(authOptions);

    const userId = session?.user.id;

    if (!userId) {
      return nextServerErrorFactory(
        403,
        'User must be logged in to perform that action'
      );
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
  } catch (e) {
    handleServerError(e);
  }
}
