import { TweetDetailsParams } from '@/app/api/tweets/[postId]/route';

import { getBody } from '@/lib/getBodyFromRequest';

import { TweetsService } from '@/server';
import { NextRequest, NextResponse } from 'next/server';

export async function editTweetController(
  req: NextRequest,
  params: TweetDetailsParams
) {
  const { postId } = params;
  const { message } = await getBody(req);

  await TweetsService.updateTweet({
    tweetId: postId,
    message,
  });

  return NextResponse.json({ postId, message });
}
