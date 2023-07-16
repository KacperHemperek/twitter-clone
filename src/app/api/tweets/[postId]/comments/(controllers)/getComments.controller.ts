import { TweetDetailsParams } from '@/app/api/tweets/[postId]/route';
import { NextRequest, NextResponse } from 'next/server';

import { getComments } from '../(services)/comments.service';

import { getServerSearchParams } from '@/lib/getServerSearchParams';

export async function getCommentsHandler(
  req: NextRequest,
  params: TweetDetailsParams
) {
  const { postId: tweetId } = params;

  const { page } = getServerSearchParams<['page']>(req, ['page']);

  const pageNumber = !!Number(page) ? Number(page) : 1;

  const comments = await getComments(tweetId, pageNumber);

  const nextPage = comments.length === 10 ? pageNumber + 1 : undefined;

  return NextResponse.json({
    data: comments,
    nextPage,
  });
}
