import { NextRequest, NextResponse } from 'next/server';

import { getLikedTweets } from '@/app/api/user/[userId]/likes/(services)/likedTweets.service';

import {
  getPageNumber,
  getServerSearchParams,
} from '@/lib/getServerSearchParams';
import { handleServerError } from '@/lib/serverError';

export async function getLikedTweetsHandler(req: NextRequest, userId: string) {
  const { page } = getServerSearchParams<['page']>(req, ['page']);

  const pageNumber = getPageNumber(page);

  try {
    const tweets = await getLikedTweets(userId, pageNumber);

    const nextPage = tweets.length === 10 ? pageNumber + 1 : undefined;

    return NextResponse.json({
      nextPage,
      data: tweets,
    });
  } catch (err) {
    return handleServerError(err);
  }
}
