import { searchTweets } from '@/app/api/search/search.service';

import { getPageNumber } from '@/lib/getServerSearchParams';
import { BadRequestError, ServerError } from '@/lib/server';

import { NextRequest, NextResponse } from 'next/server';

export async function getSearchTweetsController(req: NextRequest) {
  const url = new URL(req.url);

  const searchQ = url.searchParams.get('q');
  const page = getPageNumber(url.searchParams.get('page'));

  if (!searchQ) throw new BadRequestError('Missing search query');

  const results = await searchTweets(searchQ, page);

  const nextPage = results.length === 10 ? page + 1 : undefined;

  return NextResponse.json({ data: results, nextPage });
}
