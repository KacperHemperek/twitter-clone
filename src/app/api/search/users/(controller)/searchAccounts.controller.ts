import { searchAccounts } from '@/app/api/search/search.service';
import { NextRequest, NextResponse } from 'next/server';

import { getPageNumber } from '@/lib/getServerSearchParams';
import { ServerError } from '@/lib/serverError';

export async function searchAccountsController(req: NextRequest) {
  const url = new URL(req.url);

  const query = url.searchParams.get('q');
  const page = getPageNumber(url.searchParams.get('page'));

  if (!query)
    throw new ServerError({ code: 400, message: 'Missing search query' });

  const results = await searchAccounts(query, page);

  const nextPage = results.length === 10 ? page + 1 : undefined;

  return NextResponse.json({ data: results, nextPage });
}
