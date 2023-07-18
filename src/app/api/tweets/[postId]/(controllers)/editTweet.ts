import { TweetDetailsParams } from '@/app/api/tweets/[postId]/route';
import { NextRequest, NextResponse } from 'next/server';

import { updateTweet } from '@/app/api/tweets/(services)/tweet.service';

import { getBody } from '@/lib/getBodyFromRequest';

export async function editTweetController(
  req: NextRequest,
  params: TweetDetailsParams
) {
  const { postId } = params;
  const { message } = await getBody(req);

  await updateTweet(postId, message);

  return NextResponse.json({ postId, message });
}
