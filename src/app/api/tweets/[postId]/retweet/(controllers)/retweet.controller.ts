import { TweetDetailsParams } from '@/app/api/tweets/[postId]/route';
import { authOptions } from '@/utils/next-auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import {
  getRetweets,
  removeRetweet,
  retweetTweet,
} from '@/app/api/tweets/[postId]/retweet/(services)/retweet.service';

import { ServerError } from '@/lib/serverError';

export async function retweetHandler(
  req: NextRequest,
  params: TweetDetailsParams
) {
  const { postId: tweetId } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    throw new ServerError({ code: 401, message: 'User is not authenticated' });
  }

  const retweetIds = await getRetweets(tweetId);

  if (!!retweetIds && retweetIds?.includes(session.user.id)) {
    await removeRetweet(tweetId, session.user.id);
    return NextResponse.json({
      message: 'removed retweet from tweet with id: ' + tweetId,
    });
  }

  await retweetTweet(tweetId, session.user.id);
  return NextResponse.json({
    message: 'retweeted tweet with id: ' + tweetId,
  });
}
