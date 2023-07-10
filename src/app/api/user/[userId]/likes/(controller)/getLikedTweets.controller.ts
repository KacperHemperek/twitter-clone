import { AccountParams } from '@/app/api/user/[userId]/tweets/route';
import { NextRequest, NextResponse } from 'next/server';

import { getLikedTweets } from '@/app/api/user/[userId]/likes/(services)/likedTweets.service';

import {
  getPageNumber,
  getServerSearchParams,
} from '@/lib/getServerSearchParams';

export async function getLikedTweetsHandler(
  req: NextRequest,
  params: AccountParams
) {
  const { userId } = params;

  const { page } = getServerSearchParams<['page']>(req, ['page']);

  const pageNumber = getPageNumber(page);

  const tweets = await getLikedTweets(userId, pageNumber);

  const nextPage = tweets.length === 10 ? pageNumber + 1 : undefined;

  return NextResponse.json({
    nextPage,
    data: tweets,
  });
}
