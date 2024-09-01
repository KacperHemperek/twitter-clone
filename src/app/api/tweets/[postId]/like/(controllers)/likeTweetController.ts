import { TweetDetailsParams } from '@/app/api/tweets/[postId]/route';
import { auth } from '@/auth';
import { LikesService } from '@/server';
import { NextRequest, NextResponse } from 'next/server';

import { ServerError } from '@/lib/server';

export async function likeTweetController(
  _: NextRequest,
  params: TweetDetailsParams
) {
  const { postId: tweetId } = params;

  const session = await auth();

  const userId = session?.user.id;

  if (!userId) {
    throw new ServerError({
      code: 403,
      message: 'User must be logged in to perform that action',
    });
  }

  const isLiked = await LikesService.isLiked({ tweetId, userId });

  if (isLiked) {
    await LikesService.dislikeTweet({ userId, tweetId });
  } else {
    await LikesService.likeTweet({ userId, tweetId });
  }
  return NextResponse.json({
    message: isLiked ? 'disliked successfully' : 'liked successfully',
  });
}
