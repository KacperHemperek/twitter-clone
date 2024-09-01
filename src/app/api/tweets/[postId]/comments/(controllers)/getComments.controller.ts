import { TweetDetailsParams } from '@/app/api/tweets/[postId]/route';

import { getComments } from '../(services)/comments.service';

import { getServerSearchParams } from '@/lib/getServerSearchParams';

import { TweetsService } from '@/server';
import { NextRequest, NextResponse } from 'next/server';

export async function getCommentsHandler(
  req: NextRequest,
  params: TweetDetailsParams
) {
  const { postId: tweetId } = params;

  const { page } = getServerSearchParams<['page']>(req, ['page']);

  const pageNumber = !!Number(page) ? Number(page) : 1;

  const comments = await TweetsService.getComments({
    parentId: tweetId,
    page: pageNumber,
    limit: 10,
  });

  const nextPage = comments.length === 10 ? pageNumber + 1 : undefined;

  return NextResponse.json({
    data: comments,
    nextPage,
  });
}
