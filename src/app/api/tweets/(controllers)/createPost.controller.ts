import { authOptions } from '@/utils/next-auth';
import Filter from 'bad-words';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { createTweet } from '../(services)/tweet.service';

import { getBody } from '@/lib/getBodyFromRequest';
import {
  ServerError,
  handleServerError,
  nextServerErrorFactory,
} from '@/lib/serverError';

const BadWordFilter = new Filter();

export async function createPostController(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return nextServerErrorFactory(403, 'User is not authenticated');
    }

    const userId = session.user.id;
    const body: { tweetBody?: string } = await getBody(req);

    if (!body?.tweetBody) {
      throw new ServerError(400, 'Tweet body must not be empty');
    }

    if (BadWordFilter.isProfane(body.tweetBody)) {
      throw new ServerError(
        400,
        "You kiss your mother with that mouth?! Don't use profanity!"
      );
    }

    const newTweet = await createTweet(body.tweetBody, userId);

    return NextResponse.json({ data: { createdPost: newTweet } });
  } catch (e) {
    if (e instanceof ServerError) {
      return handleServerError(e);
    }
  }
}
