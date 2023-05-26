import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { ServerError, getNextServerError } from '@/lib/serverError';
import { NextRequest, NextResponse } from 'next/server';
import { getBody } from '@/lib/getBodyFromRequest';
import { createTweet } from '../(services)/post.service';

export async function createPostController(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return getNextServerError(403, 'User is not authenticated');
  }

  const userId = session.user.id;

  try {
    debugger;
    const body: { tweetBody?: string } = await getBody(req);

    if (!body.tweetBody) {
      throw new ServerError(400, 'Tweet body must not be empty');
    }

    const newTweet = await createTweet(body.tweetBody, userId);

    return NextResponse.json({ data: { createdPost: newTweet } });
  } catch (e) {
    if (e instanceof ServerError) {
      return getNextServerError(e.code, e.message);
    }

    return getNextServerError(500);
  }
}
