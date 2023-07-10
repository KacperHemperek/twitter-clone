import { AccountParams } from '@/app/api/user/[userId]/tweets/route';
import { NextResponse } from 'next/server';

import { getUserTweetsNew } from '@/app/api/user/[userId]/tweets/(services)/userTweets.service';

import {
  getPageNumber,
  getServerSearchParams,
} from '@/lib/getServerSearchParams';

import { Tweet } from '@/types/Tweet.type';

export async function getUserTweetsHandler(
  req: Request,
  params: AccountParams
) {
  const { userId } = params;

  const { page } = getServerSearchParams<['page']>(req, ['page']);
  const pageNumber = getPageNumber(page);

  const tweets: Tweet[] = (await getUserTweetsNew(
    userId,
    pageNumber
  )) as Tweet[];
  const nextPage = tweets.length === 10 ? pageNumber + 1 : undefined;
  return NextResponse.json({ data: tweets, nextPage });
}
