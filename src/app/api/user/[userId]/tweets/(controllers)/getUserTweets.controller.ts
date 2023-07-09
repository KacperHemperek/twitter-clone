import { NextResponse } from 'next/server';

import {
  getUserTweetsNew,
  getUsersTweets,
} from '@/app/api/user/[userId]/tweets/(services)/userTweets.service';

import {
  getPageNumber,
  getServerSearchParams,
} from '@/lib/getServerSearchParams';
import { handleServerError } from '@/lib/serverError';

import { Tweet } from '@/types/Tweet.type';

export async function getUserTweetsHandler(req: Request, userId: string) {
  const { page } = getServerSearchParams<['page']>(req, ['page']);
  const pageNumber = getPageNumber(page);
  try {
    // const tweets = await getUsersTweets(userId, pageNumber);
    const tweets: Tweet[] = (await getUserTweetsNew(userId)) as Tweet[];
    const nextPage = tweets.length === 10 ? pageNumber + 1 : undefined;
    return NextResponse.json({ data: tweets, nextPage });
  } catch (e: any) {
    console.error(e.message);
    return handleServerError(e);
  }
}
