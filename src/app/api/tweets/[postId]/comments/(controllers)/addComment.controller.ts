import { TweetDetailsParams } from '@/app/api/tweets/[postId]/route';
import { auth } from '@/auth';
import Filter from 'bad-words';
import { NextRequest, NextResponse } from 'next/server';

import { createComment } from '../(services)/comments.service';

import { getBody } from '@/lib/getBodyFromRequest';
import { ServerError, ThrowProfanityError } from '@/lib/server';

const BadWordFilter = new Filter();

export async function addCommentHandler(
  req: NextRequest,
  params: TweetDetailsParams
) {
  const { postId: tweetId } = params;

  const session = await auth();

  if (!session) {
    throw new ServerError({
      code: 403,
      message: 'User is not authenticated',
    });
  }

  const body: { tweetBody?: string } = await getBody(req);

  if (!body.tweetBody) {
    throw new ServerError({ code: 400, message: 'Wrong tweetBody required' });
  }

  if (BadWordFilter.isProfane(body.tweetBody)) {
    ThrowProfanityError();
  }

  await createComment({
    authorId: session.user.id,
    message: body.tweetBody,
    parentId: tweetId,
  });

  return NextResponse.json({ message: 'Comment createed succesfully' });
}
