import { NextRequest, NextResponse } from 'next/server';

import { searchUsers } from '../../search.service';

import { getPageNumber } from '@/lib/getServerSearchParams';

export async function searchAccountsController(req: NextRequest) {
  const url = new URL(req.url);

  const searchQ = url.searchParams.get('q');
  const page = getPageNumber(url.searchParams.get('page'));
  const limit = 10;

  if (!searchQ) {
    return NextResponse.json({ data: [], nextPage: undefined });
  }

  const results = await searchUsers({ searchQ, page: page ? page : 1, limit });

  const nextPage = results.length === limit ? page + 1 : undefined;

  return NextResponse.json({ data: results, nextPage });
}
