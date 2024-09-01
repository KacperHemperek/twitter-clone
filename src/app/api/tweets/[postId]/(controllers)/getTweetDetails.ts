import { TweetDetailsParams } from '@/app/api/tweets/[postId]/route';
import { TweetsService } from '@/server';
import { NextRequest, NextResponse } from 'next/server';

import { ServerError } from '@/lib/server';

export async function getTweetDetailsController(
  _req: NextRequest,
  params: TweetDetailsParams
) {
  const { postId: tweetId } = params;

  const tweetDetails = await TweetsService.getTweetDetails(tweetId);

  if (!tweetDetails) {
    throw new ServerError({
      code: 404,
      message: "Couldn't find tweet with given id",
    });
  }

  return NextResponse.json(tweetDetails);
}
