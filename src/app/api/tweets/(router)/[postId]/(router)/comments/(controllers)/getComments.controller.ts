import { NextRequest, NextResponse } from 'next/server';

import { getComments } from '../(services)/comments.services';

import { getServerSearchParams } from '@/lib/getServerSearchParams';
import { handleServerError } from '@/lib/serverError';

export async function getCommentsHandler(req: NextRequest, tweetId: string) {
  const { page } = getServerSearchParams<['page']>(req, ['page']);

  const pageNumber = !!Number(page) ? Number(page) : 1;

  console.log({ pageNumber });

  try {
    const comments = await getComments(tweetId, pageNumber);

    const nextPage = comments.length === 10 ? pageNumber + 1 : undefined;

    console.log({ length: comments.length });

    return NextResponse.json({
      data: comments,
      nextPage,
    });
  } catch (e) {
    handleServerError(e);
  }
}
