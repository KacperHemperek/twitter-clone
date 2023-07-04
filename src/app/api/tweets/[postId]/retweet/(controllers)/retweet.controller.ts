import { authOptions } from '@/utils/next-auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { retweetTweet } from '@/app/api/tweets/[postId]/retweet/(services)/retweet.service';

import { handleServerError, nextServerErrorFactory } from '@/lib/serverError';

export async function retweetHandler(req: NextRequest, tweetId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return nextServerErrorFactory(401, 'User is not authenticated');
  }

  try {
    await retweetTweet(tweetId, session.user.id);
    return NextResponse.json({
      message: 'retweeted tweet with id: ' + tweetId,
    });
  } catch (err) {
    return handleServerError(err);
  }
}
