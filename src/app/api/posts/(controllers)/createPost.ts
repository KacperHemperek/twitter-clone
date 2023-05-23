import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { ServerError, getNextServerError } from '@/lib/serverError';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';
import { getBody } from '@/lib/getBodyFromRequest';

async function createTweet(tweetBody: string, userId: string) {
  try {
    const newTweet = await prisma.post.create({
      data: { message: tweetBody, authorId: userId },
    });

    return newTweet;
  } catch (e) {
    throw new ServerError(500, "Couldn't create tweet");
  }
}

export async function createPostController(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return getNextServerError(403, 'User is not authenticated');
  }

  const userId = session.user.id;

  try {
    const body: { tweetBody?: string } = await getBody(req);

    if (!body.tweetBody) {
      throw new ServerError(400, 'Tweet body must not be empty');
    }

    const newTweet = createTweet(body.tweetBody, userId);

    return NextResponse.json({ data: { createdPost: newTweet } });
  } catch (e) {
    if (e instanceof ServerError) {
      return getNextServerError(e.code, e.message);
    }

    return getNextServerError(500);
  }
}
