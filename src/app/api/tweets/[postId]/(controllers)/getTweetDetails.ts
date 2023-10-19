import { TweetDetailsParams } from '@/app/api/tweets/[postId]/route';
import { NextRequest, NextResponse } from 'next/server';

import { getTweetDetails } from '../../(services)/tweet.service';

import { ServerError, nextServerErrorFactory } from '@/lib/server';

export async function getTweetDetailsController(
  _req: NextRequest,
  params: TweetDetailsParams
) {
  const { postId: tweetId } = params;

  if (!tweetId) {
    return nextServerErrorFactory(400, "Didn't find id in request");
  }

  const tweetDetails = await getTweetDetails(tweetId);

  if (!tweetDetails) {
    throw new ServerError({
      code: 404,
      message: "Couldn't find tweet with given id",
    });
  }

  return NextResponse.json(tweetDetails);
}
