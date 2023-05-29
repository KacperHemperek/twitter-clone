import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { createComment } from '../(services)/comments.services';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { getBody } from '@/lib/getBodyFromRequest';
import { ServerError, nextServerErrorFactory } from '@/lib/serverError';

export async function addCommentHandler(req: NextRequest, tweetId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ServerError(403, 'User is not authenticated');
    }

    const body: { tweetBody?: string } = await getBody(req);

    if (!body.tweetBody) {
      throw new ServerError(400, 'Wrong tweetBody required');
    }

    await createComment({
      authorId: session.user.id,
      message: body.tweetBody,
      parentId: tweetId,
    });

    return NextResponse.json({ message: 'Comment createed succesfully' });
  } catch (e) {
    if (e instanceof ServerError) {
      return nextServerErrorFactory(e.code, e.message);
    }

    return nextServerErrorFactory(500);
  }
}
