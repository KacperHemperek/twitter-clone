import { searchTweets } from '@/app/api/search/search.service';
import { NextRequest, NextResponse } from 'next/server';

import { ServerError } from '@/lib/serverError';

export async function getSearchTweetsController(req: NextRequest) {
  const url = new URL(req.url);

  const searchQ = url.searchParams.get('q');

  if (!searchQ)
    throw new ServerError({ code: 400, message: 'Missing search query' });

  const results = await searchTweets(searchQ);

  return NextResponse.json({ data: results });
}
