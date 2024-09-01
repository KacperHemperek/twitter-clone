import { TweetDetailsParams } from '@/app/api/tweets/[postId]/route';
import { auth } from '@/auth';
import Filter from 'bad-words';

import { createComment } from '../(services)/comments.service';

import { getBody } from '@/lib/getBodyFromRequest';
import {
  BadRequestError,
  ProfanityError,
  ServerError,
  UnauthorizedError,
} from '@/lib/server';

import { TweetsService } from '@/server';
import { NextRequest, NextResponse } from 'next/server';

const BadWordFilter = new Filter();

export async function addCommentHandler(
  req: NextRequest,
  params: TweetDetailsParams
) {
  const { postId: tweetId } = params;

  const session = await auth();

  if (!session) {
    throw new UnauthorizedError();
  }

  const body: { tweetBody?: string } = await getBody(req);

  if (!body.tweetBody) {
    throw new BadRequestError('tweetBody is required to create a comment');
  }

  if (BadWordFilter.isProfane(body.tweetBody)) {
    throw new ProfanityError();
  }

  await TweetsService.createComment({
    authorId: session.user.id,
    message: body.tweetBody,
    parentId: tweetId,
  });

  return NextResponse.json({ message: 'Comment created successfully' });
}
