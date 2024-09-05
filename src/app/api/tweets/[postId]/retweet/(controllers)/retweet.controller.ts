import { TweetDetailsParams } from '@/app/api/tweets/[postId]/route';
import { auth } from '@/auth';

import { UnauthorizedError } from '@/lib/server';

import { TweetsService } from '@/server';
import { NextRequest, NextResponse } from 'next/server';

export async function retweetHandler(
  _: NextRequest,
  params: TweetDetailsParams
) {
  const { postId: tweetId } = params;
  const session = await auth();

  if (!session?.user.id) {
    throw new UnauthorizedError();
  }

  const retweetUserIds = await TweetsService.getRetweetsUserIds(tweetId);
  if (retweetUserIds.includes(session.user.id)) {
    await TweetsService.removeRetweet({ tweetId, userId: session.user.id });
  } else {
    await TweetsService.retweet({ tweetId, userId: session.user.id });
  }

  return NextResponse.json({
    message: 'updated retweet status',
  });
}
