import { NextRequest, NextResponse } from 'next/server';

import { getComments } from '../(services)/comments.services';

import { ServerError, nextServerErrorFactory } from '@/lib/serverError';

export async function getCommentsHandler(req: NextRequest, tweetId: string) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get('page')) ?? 0;

  try {
    const comments = await getComments(tweetId);

    const nextPage = comments.length === 10 ? page + 1 : undefined;

    return NextResponse.json({
      data: comments,
      nextPage,
    });
  } catch (e) {
    if (e instanceof ServerError) {
      return nextServerErrorFactory(e.code, e.message);
    }
    return nextServerErrorFactory(500);
  }
}
