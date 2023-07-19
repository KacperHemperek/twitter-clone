import { searchTweets } from '@/app/api/search/search.service';
import { NextRequest, NextResponse } from 'next/server';

import { getPageNumber } from '@/lib/getServerSearchParams';
import { ServerError } from '@/lib/serverError';

export async function getSearchTweetsController(req: NextRequest) {
  const url = new URL(req.url);

  const searchQ = url.searchParams.get('q');
  const page = getPageNumber(url.searchParams.get('page'));

  if (!searchQ)
    throw new ServerError({ code: 400, message: 'Missing search query' });

  const results = await searchTweets(searchQ, page);

  const nextPage = results.length === 10 ? page + 1 : undefined;

  return NextResponse.json({ data: results, nextPage });
}
