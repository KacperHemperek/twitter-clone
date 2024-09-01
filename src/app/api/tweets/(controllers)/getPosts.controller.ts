import { TweetsService } from '@/server';
import { NextRequest, NextResponse } from 'next/server';

import {
  getPageNumber,
  getServerSearchParams,
} from '@/lib/getServerSearchParams';

export async function getPostsController(req: NextRequest) {
  const { page } = getServerSearchParams<['page']>(req, ['page']);
  const pageNumber = getPageNumber(page);

  const tweets = await TweetsService.getHomePageTweets({
    page: pageNumber,
    limit: 10,
  });

  const nextPage = tweets.length === 10 ? pageNumber + 1 : undefined;

  return NextResponse.json({ data: tweets, nextPage });
}
