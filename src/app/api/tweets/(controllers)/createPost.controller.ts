import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { createTweet } from '../(services)/post.service';

import { authOptions } from '../../auth/[...nextauth]/route';

import { getBody } from '@/lib/getBodyFromRequest';
import { ServerError, nextServerErrorFactory } from '@/lib/serverError';

export async function createPostController(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return nextServerErrorFactory(403, 'User is not authenticated');
  }

  const userId = session.user.id;

  try {
    const body: { tweetBody?: string } = await getBody(req);

    if (!body.tweetBody) {
      throw new ServerError(400, 'Tweet body must not be empty');
    }

    const newTweet = await createTweet(body.tweetBody, userId);

    return NextResponse.json({ data: { createdPost: newTweet } });
  } catch (e) {
    if (e instanceof ServerError) {
      return nextServerErrorFactory(e.code, e.message);
    }

    return nextServerErrorFactory(500);
  }
}
