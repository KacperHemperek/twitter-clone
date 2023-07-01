import { NextRequest, NextResponse } from 'next/server';

import { getMainFeedTweets } from '../(services)/tweet.service';

import {
  getPageNumber,
  getServerSearchParams,
} from '@/lib/getServerSearchParams';
import { handleServerError } from '@/lib/serverError';

export async function getPostsController(req: NextRequest) {
  const { page } = getServerSearchParams<['page']>(req, ['page']);

  const pageNumber = getPageNumber(page);

  try {
    const posts = await getMainFeedTweets(pageNumber);

    const nextPage = posts.length === 10 ? pageNumber + 1 : undefined;

    return NextResponse.json({ data: posts, nextPage });
  } catch (e) {
    handleServerError(e);
  }
}
