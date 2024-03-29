import { authOptions } from '@/utils/next-auth';
import Filter from 'bad-words';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { createTweet } from '../(services)/tweet.service';

import { getBody } from '@/lib/getBodyFromRequest';
import {
  ServerError,
  ThrowProfanityError,
  nextServerErrorFactory,
} from '@/lib/server';

const BadWordFilter = new Filter();

export async function createPostController(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return nextServerErrorFactory(403, 'User is not authenticated');
  }

  const userId = session.user.id;
  const body: { tweetBody?: string } = await getBody(req);

  if (!body?.tweetBody) {
    throw new ServerError({
      code: 400,
      message: 'Tweet body must not be empty',
    });
  }

  if (BadWordFilter.isProfane(body.tweetBody)) {
    ThrowProfanityError();
  }

  const newTweet = await createTweet(body.tweetBody, userId);

  return NextResponse.json({ data: { createdPost: newTweet } });
}
